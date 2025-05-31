import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import api from "../utils/api";

interface TaskInfoProps {
  taskId: string;
  title?: string;
  description?: string;
  onTaskDeleted?: () => void;
  onClose?: () => void;
  onDescriptionUpdated?: (newDescription: string) => void;
  darkMode?: boolean;
  priority?: string;
  dueDate?: string | Date;
  assigneeId?: string | null;
}

function TaskInfo({
  taskId,
  title,
  description,
  priority,
  dueDate,
  assigneeId,
  onTaskDeleted,
  onClose,
  onDescriptionUpdated,
  darkMode = false,
}: TaskInfoProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description || "");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const { getToken } = useAuth();

  useEffect(() => {
    setEditedDescription(description || "");
  }, [description]);

  const saveDescription = useCallback(
    async (text: string) => {
      if (!taskId || text === description) return;

      try {
        setSaveStatus("saving");
        const token = await getToken();

        await axios.put(
          api.getApiEndpoint(`/tasks/update/${taskId}`),
          { description: text },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setSaveStatus("saved");

        // Notify parent component about the description update
        if (onDescriptionUpdated) {
          onDescriptionUpdated(text);
        }

        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (error) {
        console.error("Failed to update task description:", error);
        setSaveStatus("error");
      }
    },
    [taskId, description, getToken, onDescriptionUpdated],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (editedDescription !== description) {
        saveDescription(editedDescription);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [editedDescription, saveDescription, description]);

  const handleDeleteTask = async () => {
    if (!taskId || isDeleting) return;

    try {
      setIsDeleting(true);
      const token = await getToken();

      await axios.delete(api.getApiEndpoint(`/tasks/delete/${taskId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (onTaskDeleted) {
        onTaskDeleted();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error details:", error.response?.data);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to get priority color
  const getPriorityColor = (priority: string | undefined) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return darkMode ? "text-red-400" : "text-red-500";
      case "MEDIUM":
        return darkMode ? "text-amber-400" : "text-amber-500";
      case "LOW":
        return darkMode ? "text-blue-400" : "text-blue-500";
      default:
        return darkMode ? "text-gray-400" : "text-gray-500";
    }
  };

  // Calculate time remaining or elapsed
  const getTimeStatus = () => {
    if (!dueDate) return { text: "No due date", isOverdue: false };

    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return {
        text: `${diffDays} day${diffDays !== 1 ? "s" : ""} left`,
        isOverdue: false,
      };
    } else if (diffDays === 0) {
      return {
        text: "Due today",
        isOverdue: false,
      };
    } else {
      return {
        text: `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""} overdue`,
        isOverdue: true,
      };
    }
  };

  const timeStatus = getTimeStatus();

  return (
    <motion.div
      className={`p-3 h-full rounded-lg shadow-md relative ${darkMode ? "bg-[#171717] border border-[#2C2C2C] text-white" : "bg-gray-100 text-[#212121]"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 bg-transparent hover:bg-transparent rounded-none z-50 transition-transform hover:scale-110 duration-200"
          style={{ background: "none", borderRadius: 0 }}
          aria-label="Close"
        >
          <svg
            className="w-4 h-4 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      <div
        className={`border-b pb-2 mb-3 ${darkMode ? "border-[#2C2C2C]" : "border-gray-200"}`}
      >
        <motion.h2
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`text-base font-bold ${darkMode ? "text-white" : "text-[#212121]"}`}
        >
          {title || "Task Details"}
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-3"
      >
        <div className="flex items-center justify-between mb-1">
          <label
            className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Description
          </label>
          {saveStatus === "saving" && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Saving...
            </motion.span>
          )}
          {saveStatus === "saved" && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-xs text-emerald-400`}
            >
              Saved
            </motion.span>
          )}
          {saveStatus === "error" && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-xs text-red-500`}
            >
              Error saving
            </motion.span>
          )}
        </div>
        <textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          placeholder="Add a description..."
          className={`w-full min-h-[100px] p-2 rounded border transition-colors duration-200 text-sm ${darkMode
            ? "bg-[#1C1C1C] border-[#2C2C2C] text-gray-200 placeholder-gray-500 focus:border-emerald-600"
            : "bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-emerald-500"
            } focus:outline-none focus:ring-1 focus:ring-emerald-500`}
        />
      </motion.div>

      {/* Task Details - Pill-shaped Chips Layout */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {/* Priority - Pill Shape */}
        <motion.div
          className={`inline-flex items-center py-1 px-3 rounded-full ${darkMode ? "bg-[#1C1C1C] border border-[#2C2C2C]" : "bg-white border border-gray-200"}`}
        >
          <div
            className={`h-5 w-5 flex items-center justify-center mr-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <svg
              className={`w-3 h-3 ${getPriorityColor(priority)}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className={`text-xs font-medium ${getPriorityColor(priority)}`}>
            {priority || "N/A"}
          </span>
        </motion.div>

        {/* Due Date - Pill Shape */}
        <motion.div
          className={`inline-flex items-center py-1 px-3 rounded-full ${darkMode ? "bg-[#1C1C1C] border border-[#2C2C2C]" : "bg-white border border-gray-200"}`}
        >
          <div
            className={`h-5 w-5 flex items-center justify-center mr-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <svg
              className="w-3 h-3 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span
            className={`text-xs font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            {dueDate ? new Date(dueDate).toLocaleDateString() : "N/A"}
          </span>
        </motion.div>

        {/* Assignee - Pill Shape */}
        <motion.div
          className={`inline-flex items-center py-1 px-3 rounded-full ${darkMode ? "bg-[#1C1C1C] border border-[#2C2C2C]" : "bg-white border border-gray-200"}`}
        >
          <div
            className={`h-5 w-5 flex items-center justify-center mr-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <svg
              className="w-3 h-3 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span
            className={`text-xs font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            {assigneeId
              ? assigneeId.length > 10
                ? assigneeId.substring(0, 10) + "..."
                : assigneeId
              : "Unassigned"}
          </span>
        </motion.div>

        {/* Time Status - Pill Shape */}
        <motion.div
          className={`inline-flex items-center py-1 px-3 rounded-full ${darkMode ? "bg-[#1C1C1C] border border-[#2C2C2C]" : "bg-white border border-gray-200"} ${timeStatus.isOverdue ? (darkMode ? "border-red-700" : "border-red-300") : ""}`}
        >
          <div
            className={`h-5 w-5 flex items-center justify-center mr-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <svg
              className={`w-3 h-3 ${timeStatus.isOverdue ? "text-red-500" : "text-emerald-500"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span
            className={`text-xs font-medium ${timeStatus.isOverdue ? (darkMode ? "text-red-400" : "text-red-500") : darkMode ? "text-white" : "text-gray-800"}`}
          >
            {timeStatus.text}
          </span>
        </motion.div>
      </motion.div>

      {/* Delete button positioned at bottom right */}
      <motion.div
        className="absolute bottom-3 right-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDeleteTask}
          disabled={isDeleting}
          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200
            ${darkMode
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }
            ${isDeleting ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {isDeleting ? "Deleting..." : "Delete Task"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default TaskInfo;
