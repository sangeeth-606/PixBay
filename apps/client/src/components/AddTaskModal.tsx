import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { getApiEndpoint } from "../utils/api";
import { TaskStatus, Priority, TaskType, User } from "../utils/taskTypes";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  projectId: string;
  onTaskAdded: () => void;
  workspaceMembers?: User[];
  isFetchingMembers?: boolean;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  projectId,
  onTaskAdded,
  workspaceMembers = [],
  isFetchingMembers = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [taskType, setTaskType] = useState<TaskType>(TaskType.TASK);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [assigneeId, setAssigneeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { getToken } = useAuth();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setPriority(Priority.MEDIUM);
      setTaskType(TaskType.TASK);
      setDueDate(undefined);
      setAssigneeId("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = await getToken();

      // Map workspace member ID to actual user ID
      let actualUserId = assigneeId;
      if (assigneeId) {
        const selectedAssignee = workspaceMembers.find(
          (m) => m.id === assigneeId,
        );
        if (selectedAssignee && selectedAssignee.userId) {
          actualUserId = selectedAssignee.userId;
        }
      }

      const data = {
        title,
        description,
        priority,
        type: taskType,
        status: TaskStatus.TODO,
        projectId,
        dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : undefined,
        assigneeId: actualUserId || undefined,
      };

      const apiUrl = getApiEndpoint("/api/tasks/create");
      await axios.post(apiUrl, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onTaskAdded();
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Failed to create task");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = `block w-full rounded-md border ${
    darkMode
      ? "bg-[#2C2C2C] border-gray-700 text-white"
      : "bg-white border-gray-300 text-gray-900"
  } shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2`;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`w-full max-w-md rounded-xl p-6 shadow-xl ${
              darkMode ? "bg-[#1C1C1C] text-white" : "bg-white text-gray-900"
            }`}
          >
            <Dialog.Title className="text-xl font-semibold mb-4">
              Create New Task
            </Dialog.Title>

            {error && (
              <div className="mb-4 rounded-md bg-red-500/20 p-3 text-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block mb-1 text-sm font-medium"
                >
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className={inputClasses}
                  placeholder="Task title"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block mb-1 text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={inputClasses}
                  placeholder="Task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="type"
                    className="block mb-1 text-sm font-medium"
                  >
                    Type
                  </label>
                  <select
                    id="type"
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as TaskType)}
                    className={inputClasses}
                  >
                    {Object.values(TaskType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="priority"
                    className="block mb-1 text-sm font-medium"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className={inputClasses}
                  >
                    {Object.values(Priority).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dueDate"
                    className="block mb-1 text-sm font-medium"
                  >
                    Due Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="dueDate"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground",
                          darkMode
                            ? "bg-[#2C2C2C] border-gray-700 text-white hover:bg-[#2C2C2C] focus:border-blue-500 focus:ring-blue-500 focus-visible:ring-offset-gray-900"
                            : "bg-white border-gray-300 text-gray-900 hover:bg-white focus:border-blue-500 focus:ring-blue-500",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? (
                          format(dueDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className={cn(
                        "w-auto p-0",
                        darkMode &&
                          "bg-[#2C2C2C] border-gray-700 text-white shadow-lg shadow-black/20",
                      )}
                      align="start"
                      side="top"
                      sideOffset={4}
                      avoidCollisions={true}
                      collisionBoundary={document.body}
                      sticky="always"
                    >
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                        className={
                          darkMode
                            ? "bg-[#2C2C2C] text-white [&_button:not(:disabled)]:text-white [&_.rdp-day_button:hover]:bg-gray-600 [&_.rdp-day_button[aria-selected=true]]:bg-emerald-600 [&_.rdp-nav_button:hover]:bg-gray-600 [&_.rdp-caption_dropdowns]:text-white"
                            : "[&_.rdp-day_button[aria-selected=true]]:bg-emerald-600 [&_.rdp-day_button:hover]:bg-gray-100"
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label
                    htmlFor="assignee"
                    className="block mb-1 text-sm font-medium"
                  >
                    Assignee
                  </label>
                  {isFetchingMembers ? (
                    <p className="text-sm text-gray-500">Loading members...</p>
                  ) : workspaceMembers.length > 0 ? (
                    <select
                      id="assignee"
                      value={assigneeId}
                      onChange={(e) => setAssigneeId(e.target.value)}
                      className={inputClasses}
                    >
                      <option value="">Unassigned</option>
                      {workspaceMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name || member.email || "Unknown User"}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No members available
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`rounded-md px-4 py-2 text-sm font-medium ${
                    darkMode
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`rounded-md px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddTaskModal;
