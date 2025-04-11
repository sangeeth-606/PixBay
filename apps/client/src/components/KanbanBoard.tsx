import React, { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Projectinfo from "./ProjectInfo";
import axios from "axios";

// Define enums and interfaces based on the schema
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

interface User {
  id: string;
  name: string;
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
}

// Kanban Column Component
const KanbanColumn: React.FC<ColumnProps> = ({
  status,
  tasks,
  onDrop,
  darkMode,
  onAddTask,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: string }) => onDrop(item.id, status),
  });

  drop(ref);

  const getColumnHeaderColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return darkMode ? "border-blue-500" : "border-blue-400";
      case TaskStatus.IN_PROGRESS:
        return darkMode ? "border-yellow-500" : "border-yellow-400";
      case TaskStatus.DONE:
        return darkMode ? "border-green-500" : "border-green-400";
      case TaskStatus.ARCHIVED:
        return darkMode ? "border-gray-500" : "border-gray-400";
      default:
        return darkMode ? "border-gray-500" : "border-gray-400";
    }
  };

  return (
    <div
      ref={ref}
      className={`flex-1 min-w-[300px] h-full ${
        darkMode ? "bg-[#1E1E1E]" : "bg-white"
      }`}
    >
      <div
        className={`p-6 border-t-4 h-full overflow-y-auto ${getColumnHeaderColor(status)}`}
      >
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
              <TaskCard key={task.id} task={task} darkMode={darkMode} />
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
}

// Task Card Component
const TaskCard: React.FC<TaskCardProps> = ({ task, darkMode }) => {
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

  return (
    <div
      ref={ref}
      className={`p-4 mb-4 rounded-md shadow-sm cursor-move ${
        isDragging ? "opacity-50" : ""
      } ${darkMode ? "bg-[#2C2C2C]" : "bg-white"}`}
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

// Sample dummy data
const dummyTasks: Task[] = [
  {
    id: "1",
    title: "Implement Landing Page",
    description: "Create responsive landing page with dark mode support",
    status: TaskStatus.TODO,
    priority: Priority.HIGH,
    dueDate: "2025-04-15",
    creator: { id: "u1", name: "John Doe" },
    assignee: { id: "u2", name: "Jane Smith" },
    projectId: "p1",
  },
  {
    id: "2",
    title: "Fix Authentication Bug",
    description: "Users are getting logged out unexpectedly",
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    dueDate: "2025-04-12",
    creator: { id: "u1", name: "John Doe" },
    assignee: { id: "u3", name: "Mike Johnson" },
    projectId: "p1",
  },
  {
    id: "3",
    title: "Design User Profile Page",
    description: "Create wireframes for new profile page",
    status: TaskStatus.DONE,
    priority: Priority.MEDIUM,
    dueDate: "2025-04-08",
    creator: { id: "u2", name: "Jane Smith" },
    assignee: { id: "u2", name: "Jane Smith" },
    projectId: "p1",
  },
  {
    id: "4",
    title: "Setup CI/CD Pipeline",
    status: TaskStatus.TODO,
    priority: Priority.MEDIUM,
    creator: { id: "u3", name: "Mike Johnson" },
    projectId: "p1",
  },
  {
    id: "5",
    title: "Write API Documentation",
    description: "Document all endpoints for the project",
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.LOW,
    dueDate: "2025-04-20",
    creator: { id: "u1", name: "John Doe" },
    assignee: { id: "u4", name: "Sarah Williams" },
    projectId: "p1",
  },
  {
    id: "6",
    title: "Update Dependencies",
    status: TaskStatus.DONE,
    priority: Priority.LOW,
    creator: { id: "u3", name: "Mike Johnson" },
    projectId: "p1",
  },
  {
    id: "7",
    title: "Archive Old Features",
    status: TaskStatus.ARCHIVED,
    priority: Priority.LOW,
    creator: { id: "u1", name: "John Doe" },
    projectId: "p1",
  },
];
interface KanbanBoardProps {
  projectId: string | null;
}

// const createTask=

// Add Task Modal Component
interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  projectId: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  projectId,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: Priority.MEDIUM,
    dueDate: "",
    type: "TASK",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", {
      ...formData,
      projectId,
    });
    onClose();
  };

  if (!isOpen) return null;

  const inputStyles = `w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
    darkMode
      ? "bg-[#1E1E1E] border-[#2C2C2C] text-white"
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
              className="w-full py-3 px-4 rounded-lg bg-emerald-400 hover:bg-emerald-500 text-white font-medium transition-colors duration-200"
            >
              Create Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main Kanban Board Component
const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      console.log("Project id from kanban board page ", projectId);
    }
  }, [projectId]);

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
          <Projectinfo project={projectInfo} darkMode={darkMode} />
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
        projectId={projectId || "p1"} // Fallback to 'p1' if projectId is null
      />
    </div>
  );
};

export default KanbanBoard;

const projectInfo = {
  name: "Project A",
  progress: 70,
  deadline: "April 10, 2025",
  teamMembers: 5,
};
