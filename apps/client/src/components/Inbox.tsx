import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Circle } from "lucide-react";

// Define a type for the notification
type Notification = {
  id: string;
  isRead: boolean;
  title: string;
  content: string;
  createdAt: string;
};

function Inbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        setAuthToken(token);

        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchData();
  }, [getToken]);

  const handleMarkAsRead = async (id: string) => {
    try {
      if (!authToken) return;
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex h-full flex-col bg-[#171717] text-white">
      {/* Header */}
      <div className="border-b border-[#2C2C2C] p-4">
        <div className="flex items-center">
          <Mail className="mr-2 h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-medium">Inbox</h2>
        </div>
        <p className="mt-1 text-sm text-gray-400">
          {notifications.length}{" "}
          {notifications.length === 1 ? "message" : "messages"}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No notifications yet</p>
        ) : (
          <motion.div
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(44, 44, 44, 1)",
                }}
                className="cursor-pointer rounded-md bg-[#1F1F1F] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                onClick={() => handleMarkAsRead(n.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{n.title}</p>
                    <p className="text-sm text-gray-400">{n.content}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {!n.isRead && (
                      <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
                    )}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        n.isRead
                          ? "text-gray-500 opacity-60"
                          : "text-emerald-400"
                      }`}
                    >
                      {n.isRead ? "Read" : "Unread"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Inbox;
