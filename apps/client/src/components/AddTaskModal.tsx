import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

// Define enums for the component
enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  ARCHIVED = "ARCHIVED",
}

enum Priority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

// Props for the Add Task Modal Component
interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  projectId: string;
  onTaskAdded: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  projectId,
  onTaskAdded,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: Priority.MEDIUM,
    dueDate: "",
    type: "TASK",
    status: TaskStatus.TODO,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await getToken();
      console.log(
        "Token obtained:",
        token ? `${token.substring(0, 15)}...` : "No token"
      );

      console.log("Sending request to create task with data:", {
        ...formData,
        projectId,
      });

      const response = await axios.post(
        "http://localhost:5000/api/tasks/create",
        {
          ...formData,
          projectId: projectId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        console.log("Task created successfully:", response.data);
        setFormData({
          title: "",
          description: "",
          priority: Priority.MEDIUM,
          dueDate: "",
          type: "TASK",
          status: TaskStatus.TODO,
        });
        onTaskAdded();
        onClose();
      }
    } catch (error) {
      console.error("Failed to create task - Full error details:", error);

      if (axios.isAxiosError(error)) {
        console.error("Request failed with status:", error.response?.status);
        console.error("Error message:", error.message);
        console.error("Server response data:", error.response?.data);
        console.error("Request URL:", error.config?.url);
        console.error("Request method:", error.config?.method);
        console.error("Request headers:", error.config?.headers);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputStyles = `w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
    darkMode
      ? "bg-[#171717] border-[#2C2C2C] text-white"
      : "bg-white border-gray-200 text-[#212121]"
  }`;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 backdrop-blur-md bg-black/30"
        onClick={onClose}
      ></div>
      <div
        className={`relative w-full max-w-md transform transition-all duration-300 ease-in-out ${
          darkMode
            ? "bg-[#171717]/95 border border-[#2C2C2C]"
            : "bg-gray-100/95"
        } rounded-lg shadow-xl backdrop-blur-sm`}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-[#212121]"
              }`}
            >
              Add New Task
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:bg-opacity-80 ${
                darkMode
                  ? "text-gray-400 hover:bg-[#2C2C2C]"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <svg
                className="w-5 h-5"
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
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className={`block mb-2 font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Title <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={inputStyles}
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label
                className={`block mb-2 font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={inputStyles}
                rows={3}
                placeholder="Enter task description"
              />
            </div>
            <div>
              <label
                className={`block mb-2 font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as TaskStatus,
                  })
                }
                className={inputStyles}
              >
                <option value={TaskStatus.TODO}>To Do</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.DONE}>Done</option>
                <option value={TaskStatus.ARCHIVED}>Archived</option>
              </select>
            </div>
            <div>
              <label
                className={`block mb-2 font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as Priority,
                  })
                }
                className={inputStyles}
              >
                <option value={Priority.LOW}>Low</option>
                <option value={Priority.MEDIUM}>Medium</option>
                <option value={Priority.HIGH}>High</option>
              </select>
            </div>
            <div>
              <label
                className={`block mb-2 font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className={inputStyles}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-emerald-400 hover:bg-emerald-500 text-white font-medium transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
export { TaskStatus, Priority };
