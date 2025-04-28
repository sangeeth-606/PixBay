import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import AddTaskModal from "./AddTaskModal";
import TaskInfo from "./TaskInfo";
import Board from "./Board";
import Projectinfo from "./ProjectInfo";
import { Task, User, TaskStatus } from "../utils/taskTypes";

interface KanbanBoardProps {
  projectId: string | null;
  workspaceName?: string | null;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  projectId,
  workspaceName: propWorkspaceName,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskInfoModalOpen, setIsTaskInfoModalOpen] = useState(false);
  const [workspaceMembers, setWorkspaceMembers] = useState<User[]>([]);
  const [workspaceName, setWorkspaceName] = useState<string | null>(
    propWorkspaceName || null
  );
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const { getToken } = useAuth();

  const extractProjectIdFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("projectId") || null;
  };

  const effectiveProjectId = projectId || extractProjectIdFromUrl();

  useEffect(() => {
    if (propWorkspaceName) {
      setWorkspaceName(propWorkspaceName);
    }
  }, [propWorkspaceName]);

  const fetchProjectDetails = async () => {
    if (!workspaceName && effectiveProjectId) {
      try {
        const token = await getToken();
        const response = await axios.get(
          `http://localhost:5000/api/projects/${effectiveProjectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data && response.data.workspace) {
          setWorkspaceName(response.data.workspace.name);
        }
      } catch (error) {
        console.error("Failed to fetch project details:", error);
      }
    }
  };

  const fetchWorkspaceMembers = async () => {
    if (!workspaceName) return;
    setIsFetchingMembers(true);
    try {
      const token = await getToken();
      const response = await axios.get(
        `http://localhost:5000/api/workspaces/${encodeURIComponent(
          workspaceName
        )}/members`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data && response.data.members) {
        setWorkspaceMembers(response.data.members);
      }
    } catch (error) {
      console.error("Failed to fetch workspace members:", error);
    } finally {
      setIsFetchingMembers(false);
    }
  };

  const fetchTasks = async () => {
    if (!effectiveProjectId) return;
    try {
      const token = await getToken();
      const response = await axios.get(
        `http://localhost:5000/api/tasks/task/${effectiveProjectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("API response for tasks:", response.data); // Debug log
      if (response.data && Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.warn("API returned invalid tasks data, defaulting to empty array");
        setTasks([]);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    if (effectiveProjectId) {
      fetchTasks();
      if (!workspaceName) {
        fetchProjectDetails();
      }
    }
  }, [effectiveProjectId, workspaceName]);

  useEffect(() => {
    if (workspaceName) {
      fetchWorkspaceMembers();
    }
  }, [workspaceName]);

  const handleTaskMoved = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const token = await getToken();
      await axios.put(
        `http://localhost:5000/api/tasks/update/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to update task status:", error);
      fetchTasks(); // Re-fetch tasks to revert on error
    }
  };

  const handleTaskDeleted = async (taskId: string) => {
    try {
      const token = await getToken();
      // Correct the API endpoint to match the server route
      await axios.delete(`http://localhost:5000/api/tasks/delete/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Optionally remove the task from local state *after* successful deletion
      // setTasks((prev) => prev.filter((t) => t.id !== taskId));
      // Refresh tasks to ensure consistency
      refreshTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
      // No need to call fetchTasks here if refreshTasks is called on success,
      // as the task wasn't removed locally on failure.
      // If you optimistically remove the task before the API call,
      // you would need to re-fetch on error.
    }
  };

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId) || null;
    setSelectedTask(task);
    setIsTaskInfoModalOpen(true);
  };

  const refreshTasks = () => {
    fetchTasks();
  };

  console.log("Tasks before rendering Board:", tasks); // Debug log

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#1C1C1C] text-white" : "bg-[#F5F5F5] text-[#212121]"
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-4">
        <div className="py-6">
          <Projectinfo darkMode={darkMode} />
        </div>
        <div
          className={`mb-6 rounded-lg shadow-md h-[calc(100vh-240px)] ${
            darkMode ? "bg-[#171717] border border-[#2C2C2C]" : "bg-gray-100"
          }`}
        >
          <Board
            tasks={tasks}
            setTasks={setTasks}
            onTaskMoved={handleTaskMoved}
            onTaskDeleted={handleTaskDeleted}
            onTaskClick={handleTaskClick}
            onAddTaskClick={() => setIsAddModalOpen(true)}
            darkMode={darkMode}
          />
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        darkMode={darkMode}
        projectId={effectiveProjectId || ""}
        onTaskAdded={refreshTasks}
        workspaceMembers={workspaceMembers}
        isFetchingMembers={isFetchingMembers}
      />

      {selectedTask && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            isTaskInfoModalOpen ? "" : "hidden"
          }`}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            onClick={() => setIsTaskInfoModalOpen(false)}
          ></div>
          <div className="relative z-10 w-full max-w-4xl h-[80vh] overflow-y-auto rounded-lg shadow-xl">
            <button
              className={`absolute top-4 right-4 z-20 p-2 rounded-full ${
                darkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setIsTaskInfoModalOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <TaskInfo
              taskId={selectedTask.id}
              title={selectedTask.title}
              description={selectedTask.description}
              darkMode={darkMode}
              onTaskDeleted={() => {
                setIsTaskInfoModalOpen(false);
                setSelectedTask(null);
                refreshTasks();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;