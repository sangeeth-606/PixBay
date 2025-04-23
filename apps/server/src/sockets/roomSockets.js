import prisma from "../db";

export const roomSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", async (roomName, peerId) => {
      console.log("Join-room received:", roomName, peerId);
      socket.join(roomName);
      socket.to(roomName).emit("user-connected", peerId);

      try {
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

    socket.on("send-message", async ({ roomCode, message, email }) => {
      console.log("Chat message received:", message, "for room:", roomCode);
      try {
        // Look up the User by clerkId to get the correct User.id
        const user = await prisma.user.findFirst({
          where: { email: email },
        });

        if (!user) {
          throw new Error(`User with email ${email} not found`);
        }

        // Use the User's UUID id for the foreign key
        const newMessage = await prisma.chatMessage.create({
          data: {
            roomName: roomCode,
            userId: user.id,
            message: message.text,
          },
        });

        const messageData = {
          sender: message.sender,
          text: message.text,
          timestamp: newMessage.createdAt,
        };
        io.to(roomCode).emit("receive-message", messageData);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
