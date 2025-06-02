import prisma from "../db.js";

export const roomSockets = (io) => {
  // Use Map for better memory management
  const whiteboardHistory = new Map();
  // Track connected users per room
  const connectedUsers = new Map();

  io.on("connection", (socket) => {
    const { roomCode, userId } = socket.handshake.query;
    console.log(
      "User connected:",
      socket.id,
      "Room:",
      roomCode,
      "User:",
      userId
    );

    // Handle reconnection
    if (roomCode) {
      socket.join(roomCode);
      if (!connectedUsers.has(roomCode)) {
        connectedUsers.set(roomCode, new Set());
      }
      connectedUsers.get(roomCode).add(socket.id);
    }

    socket.on("join-room", async (roomName, peerId) => {
      console.log("Join-room received:", roomName, peerId);
      socket.join(roomName);
      socket.to(roomName).emit("user-connected", peerId);

      try {
        // Fetch chat messages
        const messages = await prisma.chatMessage.findMany({
          where: { roomName: roomName },
          orderBy: { createdAt: "asc" },
          include: { user: { select: { name: true } } },
        });
        const formattedMessages = messages.map((msg) => ({
          sender: msg.user.name,
          text: msg.message,
          timestamp: msg.createdAt,
        }));
        socket.emit("previous-messages", formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id, peerId);
        socket.to(roomName).emit("user-disconnected", peerId);
      });
    });

    // Chat message handling
    socket.on("send-message", async ({ roomCode, message, email }) => {
      console.log("Chat message received:", message, "for room:", roomCode);
      try {
        const user = await prisma.user.findFirst({
          where: { email: email },
        });

        if (!user) {
          throw new Error(`User with email ${email} not found`);
        }

        const newMessage = await prisma.chatMessage.create({
          data: {
            roomName: roomCode,
            userId: user.id,
            message: message.text,
          },
        });

        const messageData = {
          sender: user.name,
          text: message.text,
          timestamp: newMessage.createdAt,
        };
        io.to(roomCode).emit("receive-message", messageData);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // Whiteboard handling
    socket.on("join-whiteboard", (roomCode) => {
      console.log(`User ${socket.id} joined whiteboard for room: ${roomCode}`);
      socket.join(roomCode);

      // Initialize room history if needed
      if (!whiteboardHistory.has(roomCode)) {
        whiteboardHistory.set(roomCode, []);
      }

      // Send existing history
      socket.emit("whiteboard-history", whiteboardHistory.get(roomCode));
    });

    socket.on("get-whiteboard-history", (roomCode) => {
      if (whiteboardHistory.has(roomCode)) {
        socket.emit("whiteboard-history", whiteboardHistory.get(roomCode));
      }
    });

    socket.on("whiteboard-action", ({ roomCode, action }) => {
      if (!whiteboardHistory.has(roomCode)) {
        whiteboardHistory.set(roomCode, []);
      }

      const history = whiteboardHistory.get(roomCode);
      history.push(action);

      // Limit history size to prevent memory issues
      if (history.length > 10000) {
        history.splice(0, 1000); // Remove old actions when limit is reached
      }

      // Broadcast to all users in room
      io.to(roomCode).emit("whiteboard-action", action);
    });

    socket.on("whiteboard-clear", (roomCode) => {
      if (whiteboardHistory.has(roomCode)) {
        whiteboardHistory.set(roomCode, []);
      }

      const history = whiteboardHistory.get(roomCode);

      // Optimize batch processing
      const processedActions = actions.map((action) => ({
        ...action,
        timestamp: Date.now(), // Add timestamp for synchronization
      }));

      // Process actions in chunks for better performance
      const chunkSize = 10;
      for (let i = 0; i < processedActions.length; i += chunkSize) {
        const chunk = processedActions.slice(i, i + chunkSize);
        history.push(...chunk);

        // Broadcast chunk to room members
        socket.to(roomCode).emit("whiteboard-batch", chunk);
      }

      // Keep history size manageable
      if (history.length > 10000) {
        const keepLast = 5000;
        history.splice(0, history.length - keepLast);
        console.log(
          `Trimmed history for room ${roomCode} to ${keepLast} actions`
        );
      }
    });

    socket.on("whiteboard-clear", (roomCode) => {
      if (whiteboardHistory.has(roomCode)) {
        whiteboardHistory.set(roomCode, []);
        io.to(roomCode).emit("whiteboard-history", []);
      }
    });

    socket.on("whiteboard-undo", ({ roomCode }) => {
      if (whiteboardHistory.has(roomCode)) {
        const history = whiteboardHistory.get(roomCode);
        if (history.length > 0) {
          history.pop();
          io.to(roomCode).emit("whiteboard-history", history);
        }
      }
    });

    // Enhanced cleanup on disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      if (roomCode) {
        // Handle connected users cleanup
        if (connectedUsers.has(roomCode)) {
          connectedUsers.get(roomCode).delete(socket.id);
          if (connectedUsers.get(roomCode).size === 0) {
            connectedUsers.delete(roomCode);
            console.log(`Room ${roomCode} is now empty`);
          }
        }

        // Check if room is completely empty
        const room = io.sockets.adapter.rooms.get(roomCode);
        if (!room || room.size === 0) {
          // Optional: Save history to persistent storage before clearing
          // await saveHistoryToDB(roomCode, whiteboardHistory.get(roomCode));

          whiteboardHistory.delete(roomCode);
          console.log(`Cleaned up whiteboard history for room: ${roomCode}`);
        }
      }
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
      // Attempt to clean up if error occurs
      if (roomCode) {
        connectedUsers.get(roomCode)?.delete(socket.id);
      }
    });

    // End of socket connection handling
  });

  // End of roomSockets export
};
