import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Projectinfo from './ProjectInfo';

// Define enums and interfaces based on the schema
enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED',
}

enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
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
}

// Kanban Column Component
const KanbanColumn: React.FC<ColumnProps> = ({ status, tasks, onDrop, darkMode }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string }) => onDrop(item.id, status),
  });

  // Apply the drop ref to our DOM element
  drop(ref);

  return (
    <div 
      ref={ref} 
      className={`p-4 rounded-md w-1/4 min-h-[400px] shadow-md ${
        darkMode ? 'bg-[#171717] border border-[#2C2C2C]' : 'bg-gray-100'
      }`}
    >
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
        {status}
      </h2>
      {tasks.length === 0 ? (
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No tasks
        </p>
      ) : (
        tasks.map((task) => <TaskCard key={task.id} task={task} darkMode={darkMode} />)
      )}
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
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Apply the drag ref to our DOM element
  drag(ref);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return 'bg-red-500 text-white';
      case Priority.MEDIUM:
        return 'bg-yellow-500 text-black';
      case Priority.LOW:
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div
      ref={ref}
      className={`p-4 mb-4 rounded-md shadow-sm cursor-move ${
        isDragging ? 'opacity-50' : ''
      } ${darkMode ? 'bg-[#2C2C2C]' : 'bg-white'}`}
    >
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
        {task.title}
      </h3>
      {task.description && (
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {task.description}
        </p>
      )}
      <div className="mt-2">
        <span
          className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}
        >
          {task.priority}
        </span>
      </div>
      {task.dueDate && (
        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Creator: {task.creator.name}
      </p>
      {task.assignee && (
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Assignee: {task.assignee.name}
        </p>
      )}
    </div>
  );
};

// Sample dummy data
const dummyTasks: Task[] = [
  {
    id: '1',
    title: 'Implement Landing Page',
    description: 'Create responsive landing page with dark mode support',
    status: TaskStatus.TODO,
    priority: Priority.HIGH,
    dueDate: '2025-04-15',
    creator: { id: 'u1', name: 'John Doe' },
    assignee: { id: 'u2', name: 'Jane Smith' },
    projectId: 'p1',
  },
  {
    id: '2',
    title: 'Fix Authentication Bug',
    description: 'Users are getting logged out unexpectedly',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    dueDate: '2025-04-12',
    creator: { id: 'u1', name: 'John Doe' },
    assignee: { id: 'u3', name: 'Mike Johnson' },
    projectId: 'p1',
  },
  {
    id: '3',
    title: 'Design User Profile Page',
    description: 'Create wireframes for new profile page',
    status: TaskStatus.DONE,
    priority: Priority.MEDIUM,
    dueDate: '2025-04-08',
    creator: { id: 'u2', name: 'Jane Smith' },
    assignee: { id: 'u2', name: 'Jane Smith' },
    projectId: 'p1',
  },
  {
    id: '4',
    title: 'Setup CI/CD Pipeline',
    status: TaskStatus.TODO,
    priority: Priority.MEDIUM,
    creator: { id: 'u3', name: 'Mike Johnson' },
    projectId: 'p1',
  },
  {
    id: '5',
    title: 'Write API Documentation',
    description: 'Document all endpoints for the project',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.LOW,
    dueDate: '2025-04-20',
    creator: { id: 'u1', name: 'John Doe' },
    assignee: { id: 'u4', name: 'Sarah Williams' },
    projectId: 'p1',
  },
  {
    id: '6',
    title: 'Update Dependencies',
    status: TaskStatus.DONE,
    priority: Priority.LOW,
    creator: { id: 'u3', name: 'Mike Johnson' },
    projectId: 'p1',
  },
  {
    id: '7',
    title: 'Archive Old Features',
    status: TaskStatus.ARCHIVED,
    priority: Priority.LOW,
    creator: { id: 'u1', name: 'John Doe' },
    projectId: 'p1',
  },
];

// Main Kanban Board Component
const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Handle task drop to update status
  const handleDrop = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Categorize tasks by status
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
    <div className={darkMode ? 'bg-[#1C1C1C]' : 'bg-[#F5F5F5]'}>
      <div>
        <Projectinfo project={projectInfo} darkMode={darkMode} />
        {/* <button
          onClick={toggleDarkMode}
          className={`px-4 py-2 rounded-md ${
            darkMode 
              ? 'bg-[#2C2C2C] text-white hover:bg-[#333]' 
              : 'bg-gray-200 text-[#212121] hover:bg-gray-300'
          }`}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button> */}
      </div>
      
      <DndProvider backend={HTML5Backend}>
        <div className="flex space-x-4 p-6 min-h-screen">
          {categorizedTasks.map((column) => (
            <KanbanColumn
              key={column.status}
              status={column.status}
              tasks={column.tasks}
              onDrop={handleDrop}
              darkMode={darkMode}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
};

export default KanbanBoard;

const projectInfo = {
    name: 'Project A',
    progress: 70,
    deadline: 'April 10, 2025',
    teamMembers: 5
  };