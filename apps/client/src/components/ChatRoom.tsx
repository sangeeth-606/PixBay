import React, { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatRoomProps {
  roomCode: string;
  userId: string;
  onClose: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomCode, userId, onClose }) => {
  const [messages, setMessages] = useState<
    { sender: string; text: string; timestamp: Date }[]
  >([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", { transports: ["polling"] });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("ChatRoom connected:", newSocket.id);
      newSocket.emit("join-room", roomCode, "chat-only");
    });

    newSocket.on("previous-messages", (prevMsgs) => {
      console.log("Previous messages received:", prevMsgs);
      setMessages(prevMsgs);
    });

    newSocket.on("receive-message", (message) => {
      console.log("New message received:", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomCode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && socket) {
      const message = {
        sender: userId,
        text: input,
      };
      socket.emit("send-message", { roomCode, message, email: userId });
      setInput("");
    }
  };

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <motion.div
      className="h-full flex flex-col bg-[#171717] rounded-md shadow-lg border-l border-[#3C3C3C]"
      style={{ boxShadow: "-1px 0 0 0 rgba(255,255,255,0.05)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center p-4 border-b border-[#2C2C2C]">
        <motion.h2
          className="font-medium text-white flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-emerald-500 mr-2">Chat</span>
          {/* <span className="text-gray-400 text-sm">{roomCode}</span> */}
        </motion.h2>
        <motion.button
          onClick={onClose}
          className="p-1 hover:bg-[#2C2C2C] rounded-md transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={18} className="text-gray-400 hover:text-white" />
        </motion.button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2C2C2C] scrollbar-track-transparent">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={classNames(
                "w-full",
                msg.sender === userId
                  ? "flex justify-end"
                  : "flex justify-start"
              )}
            >
              <motion.div
                className={classNames("mb-1 p-1 rounded-md max-w-[80%]")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                <div className="text-emerald-500 text-xs mb-0.5 font-medium">
                  {msg.sender}
                </div>
                <div className="text-white text-sm">{msg.text}</div>
              </motion.div>
            </div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[#2C2C2C]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 p-2 bg-[#2C2C2C] text-white rounded-md border border-[#3C3C3C] focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="Type a message..."
          />
          <motion.button
            onClick={sendMessage}
            className={classNames(
              "p-2 rounded-md text-white flex items-center justify-center",
              input.trim()
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-[#2C2C2C] text-gray-500 cursor-not-allowed"
            )}
            disabled={!input.trim()}
            whileHover={input.trim() ? { scale: 1.05 } : {}}
            whileTap={input.trim() ? { scale: 0.95 } : {}}
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatRoom;
