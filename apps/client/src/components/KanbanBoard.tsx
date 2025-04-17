import React, { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Projectinfo from "./ProjectInfo";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import AddTaskModal, { TaskStatus, Priority } from "./AddTaskModal";
import TaskInfo from "./TaskInfo"; // Import the TaskInfo component

// Update User interface to match the one in AddTaskModal.tsx
interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  joinedAt: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  creator: User;
  assignee?: User;
  projectId: string;
}

// Props for the Kanban column
interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDrop: (taskId: string, newStatus: TaskStatus) => void;
  darkMode: boolean;
  onAddTask?: () => void;
  onTaskClick: (taskId: string) => void; // Add new prop
}

// Kanban Column Component
const KanbanColumn: React.FC<ColumnProps> = ({
  status,
  tasks,
  onDrop,
  darkMode,
  onAddTask,
  onTaskClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: string }) => onDrop(item.id, status),
  });

  drop(ref);

  return (
    <div
      ref={ref}
      className={`flex-1 min-w-[300px] h-full ${
        darkMode ? "bg-[#171717]" : "bg-white"
      }`}
    >
      <div className={`p-6 h-full overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-[#212121]"
            }`}
          >
            {status}
            <span className="text-sm font-normal ml-2 text-gray-500">
              ({tasks.length})
            </span>
          </h2>
          {status === TaskStatus.TODO && onAddTask && (
            <button
              onClick={onAddTask}
              className={`py-1 px-3 rounded-md ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white font-medium text-sm flex items-center`}
            >
              <span className="mr-1">+</span> Add
            </button>
          )}
        </div>
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } text-center py-4`}
            >
              No tasks
            </p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                darkMode={darkMode}
                onTaskClick={onTaskClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Props for the Task Card
interface TaskCardProps {
  task: Task;
  darkMode: boolean;
  onTaskClick: (taskId: string) => void; // Add click handler prop
}

// Task Card Component
const TaskCard: React.FC<TaskCardProps> = ({ task, darkMode, onTaskClick }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return "bg-red-500";
      case Priority.MEDIUM:
        return "bg-yellow-500";
      case Priority.LOW:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click from triggering drag
    if (!isDragging) {
      onTaskClick(task.id);
    }
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`p-4 mb-4 rounded-md shadow-sm ${
        isDragging ? "opacity-50 cursor-move" : "cursor-pointer hover:shadow-md"
      } ${darkMode ? "bg-[#2C2C2C]" : "bg-white"} transition-shadow`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3
          className={`text-lg font-semibold ${darkMode ? "text-white" : "text-[#212121]"}`}
        >
          {task.title}
        </h3>
        <div
          className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}
          title={`Priority: ${task.priority}`}
        />
      </div>
      {task.description && (
        <p
          className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          {task.description}
        </p>
      )}
      {task.dueDate && (
        <p
          className={`text-xs mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
      <p
        className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        Creator: {task.creator.name}
      </p>
      {task.assignee && (
        <p
          className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          Assignee: {task.assignee.name}
        </p>
      )}
    </div>
  );
};

interface KanbanBoardProps {
  projectId: string | null;
}

// Main Kanban Board Component
const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]); // Initialize with empty array instead of dummyTasks
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Updated state variable for selected task
  const [isTaskInfoModalOpen, setIsTaskInfoModalOpen] = useState(false); // New state variable for task info modal
  const [workspaceMembers, setWorkspaceMembers] = useState<User[]>([]);
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const { getToken } = useAuth();

  // Extract projectId from URL if not provided explicitly
  const extractProjectIdFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("projectId") || null;
  };

  const effectiveProjectId = projectId || extractProjectIdFromUrl();

  const fetchProjectDetails = async () => {
    if (!effectiveProjectId) return;

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
  };

  const fetchWorkspaceMembers = async () => {
    if (!workspaceName) return;

    try {
      const token = await getToken();
      const response = await axios.get(
        `http://localhost:5000/api/workspaces/${encodeURIComponent(workspaceName)}/members`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.members) {
        setWorkspaceMembers(response.data.members);
      }
    } catch (error) {
      console.error("Failed to fetch workspace members:", error);
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

      if (response.data) {
        console.log("Fetched tasks:", response.data);
        setTasks(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error details:", error.response?.data);
      }
    }
  };

  useEffect(() => {
    if (effectiveProjectId) {
      console.log("Project id from kanban board page ", effectiveProjectId);
      fetchTasks();
      fetchProjectDetails();
    }
  }, [effectiveProjectId]);

  useEffect(() => {
    if (workspaceName) {
      fetchWorkspaceMembers();
    }
  }, [workspaceName]);

  const handleDrop = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Pass this function to refresh tasks after a new task is created
  const refreshTasks = () => {
    console.log("Refreshing tasks...");
    fetchTasks();
  };

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId) || null;
    setSelectedTask(task);
    setIsTaskInfoModalOpen(true);
  };

  const handleTaskDeleted = () => {
    setIsTaskInfoModalOpen(false);
    setSelectedTask(null);
    refreshTasks();
  };

  const columns: TaskStatus[] = [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
    TaskStatus.ARCHIVED,
  ];
  const categorizedTasks = columns.map((status) => ({
    status,
    tasks: tasks.filter((task) => task.status === status),
  }));

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

        <DndProvider backend={HTML5Backend}>
          <div
            className={`mb-6 rounded-lg shadow-md h-[calc(100vh-240px)] ${
              darkMode ? "bg-[#171717] border border-[#2C2C2C]" : "bg-gray-100"
            }`}
          >
            <div className="flex divide-x divide-gray-700 h-full">
              {categorizedTasks.map((column) => (
                <KanbanColumn
                  key={column.status}
                  status={column.status}
                  tasks={column.tasks}
                  onDrop={handleDrop}
                  darkMode={darkMode}
                  onTaskClick={handleTaskClick}
                  onAddTask={
                    column.status === TaskStatus.TODO
                      ? () => setIsAddModalOpen(true)
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </DndProvider>
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        darkMode={darkMode}
        projectId={effectiveProjectId || ""} // Use empty string instead of p1 as fallback
        onTaskAdded={refreshTasks} // Add this new prop
        workspaceMembers={workspaceMembers} // Pass workspace members to modal
      />

      {/* Task Info Modal */}
      {selectedTask && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${isTaskInfoModalOpen ? "" : "hidden"}`}
        >
          {/* Semi-transparent overlay with stronger blur effect */}
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
              className={`absolute top-4 right-4 z-20 p-2 rounded-full ${darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
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
              onTaskDeleted={handleTaskDeleted}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
