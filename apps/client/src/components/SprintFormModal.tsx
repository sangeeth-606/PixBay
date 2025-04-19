import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

interface Project {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
}

interface SprintFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
  workspaceName: string;
  onSprintCreated?: () => void;
}

export function SprintFormModal({
  isOpen,
  onClose,
  darkMode = true,
  workspaceName,
  onSprintCreated,
}: SprintFormModalProps) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [projectsError, setProjectsError] = useState("");

  const { getToken } = useAuth();

  // Fetch projects when modal opens
  useEffect(() => {
    if (isOpen && workspaceName) {
      const fetchProjects = async () => {
        try {
          const token = await getToken();
          const response = await axios.get(
            `http://localhost:5000/api/projects/workspace/${workspaceName}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setProjects(response.data);
        } catch (err: any) {
          setProjectsError("Failed to fetch projects");
          console.error("Error fetching projects:", err);
        }
      };
      fetchProjects();
    }
  }, [isOpen, workspaceName, getToken]);

  // Reset form state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setName("");
      setGoal("");
      setStartDate("");
      setEndDate("");
      setSelectedProjectId("");
      setError("");
      setProjectsError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProjectId) {
      setError("Please select a project");
      return;
    }

    if (!name) {
      setError("Sprint name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = await getToken();
      await axios.post(
        "http://localhost:5000/api/sprints/create",
        {
          name,
          goal,
          startDate: startDate || null,
          endDate: endDate || null,
          projectId: selectedProjectId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onClose();
      if (onSprintCreated) {
        onSprintCreated();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create sprint");
      console.error("Error creating sprint:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const inputStyles = `w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
    darkMode
      ? "bg-[#171717] border-[#2C2C2C] text-white"
      : "bg-white border-gray-200 text-[#212121]"
  }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          <div
            className="absolute inset-0 backdrop-blur-md bg-black/30"
            onClick={onClose}
          ></div>
          <motion.div
            className={`relative w-full max-w-md transform transition-all duration-300 ease-in-out ${
              darkMode
                ? "bg-[#171717]/95 border border-[#2C2C2C]"
                : "bg-gray-100/95"
            } rounded-lg shadow-xl backdrop-blur-sm`}
            variants={modalVariants}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-[#212121]"
                  }`}
                >
                  Create New Sprint
                </h2>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full hover:bg-opacity-80 ${
                    darkMode
                      ? "text-gray-400 hover:bg-[#2C2C2C]"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    className={`block mb-2 font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Sprint Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputStyles}
                    placeholder="Enter sprint name"
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block mb-2 font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Project <span className="text-emerald-400">*</span>
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className={inputStyles}
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className={`block mb-2 font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Sprint Goal
                  </label>
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className={inputStyles}
                    placeholder="What's the goal of this sprint?"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block mb-2 font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={inputStyles}
                    />
                  </div>

                  <div>
                    <label
                      className={`block mb-2 font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={inputStyles}
                    />
                  </div>
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                {projectsError && (
                  <div className="text-red-500 text-sm">{projectsError}</div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg bg-emerald-400 hover:bg-emerald-500 text-white font-medium transition-colors duration-200 flex items-center justify-center relative overflow-hidden"
                >
                  {isLoading ? (
                    <>
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
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
                        <span className="ml-1">Creating...</span>
                      </span>
                      <span className="opacity-0">Create Sprint</span>
                    </>
                  ) : (
                    "Create Sprint"
                  )}
                  {isLoading && (
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-700/40 to-emerald-600/40 animate-pulse rounded-lg"></span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
