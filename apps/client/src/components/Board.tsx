import React, { useState } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { FaFire } from "react-icons/fa";
import { Task, TaskStatus } from "../utils/taskTypes";

/** Interface for Board component props */
interface BoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onTaskMoved: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onTaskDeleted: (taskId: string) => Promise<void>;
  onTaskClick: (taskId: string) => void;
  onAddTaskClick: () => void;
  darkMode: boolean;
}

/** Board Component */
const Board: React.FC<BoardProps> = ({
  tasks,
  setTasks,
  onTaskMoved,
  onTaskDeleted,
  onTaskClick,
  onAddTaskClick,
  darkMode,
}) => {
  return (
    <div
      className={`flex h-full w-full gap-6 p-6 overflow-x-auto overflow-y-auto ${
        darkMode ? "bg-[#171717]" : "bg-gray-100"
      }`}
    >
      <Column
        title="TODO"
        column={TaskStatus.TODO}
        headingColor="text-yellow-200"
        tasks={tasks}
        setTasks={setTasks}
        onTaskMoved={onTaskMoved}
        onTaskClick={onTaskClick}
        onAddTaskClick={onAddTaskClick}
        showAddButton={true}
        darkMode={darkMode}
      />
      <Column
        title="IN PROGRESS"
        column={TaskStatus.IN_PROGRESS}
        headingColor="text-blue-200"
        tasks={tasks}
        setTasks={setTasks}
        onTaskMoved={onTaskMoved}
        onTaskClick={onTaskClick}
        darkMode={darkMode}
      />
      <Column
        title="DONE"
        column={TaskStatus.DONE}
        headingColor="text-emerald-200"
        tasks={tasks}
        setTasks={setTasks}
        onTaskMoved={onTaskMoved}
        onTaskClick={onTaskClick}
        darkMode={darkMode}
      />
      <Column
        title="ARCHIVED"
        column={TaskStatus.ARCHIVED}
        headingColor="text-neutral-500"
        tasks={tasks}
        setTasks={setTasks}
        onTaskMoved={onTaskMoved}
        onTaskClick={onTaskClick}
        darkMode={darkMode}
      />
      <div className="ml-auto">
        <BurnBarrel
          setTasks={setTasks}
          onTaskDeleted={onTaskDeleted}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

/** Interface for Column component props */
interface ColumnProps {
  title: string;
  column: TaskStatus;
  headingColor: string;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onTaskMoved: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onTaskClick: (taskId: string) => void;
  onAddTaskClick?: () => void;
  showAddButton?: boolean;
  darkMode: boolean;
}

/** Column Component */
const Column: React.FC<ColumnProps> = ({
  title,
  column,
  headingColor,
  tasks = [],
  setTasks,
  onTaskMoved,
  onTaskClick,
  onAddTaskClick,
  showAddButton = false,
  darkMode,
}) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDragEnd = async (e: React.DragEvent) => {
    const taskId = e.dataTransfer.getData("taskId");

    setActive(false);
    clearHighlights();

    if (!tasks) {
      console.error("Tasks array is undefined");
      return;
    }

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== taskId) {
      let copy = [...tasks];
      let taskToTransfer = copy.find((t) => t.id === taskId);
      if (!taskToTransfer) return;
      taskToTransfer = { ...taskToTransfer, status: column };

      copy = copy.filter((t) => t.id !== taskId);

      const moveToBack = before === "-1";
      if (moveToBack) {
        copy.push(taskToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === -1) return;
        copy.splice(insertAtIndex, 0, taskToTransfer);
      }

      setTasks(copy);
      await onTaskMoved(taskId, column);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => (i.style.opacity = "0"));
  };

  const highlightIndicator = (e: React.DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (
    e: React.DragEvent,
    indicators: HTMLElement[],
  ) => {
    const DISTANCE_OFFSET = 50;
    return indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      },
    );
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`[data-column="${column}"]`),
    ) as HTMLElement[];
  };

  const filteredTasks = tasks ? tasks.filter((t) => t.status === column) : [];

  return (
    <div className="w-72 shrink-0">
      {" "}
      {/* Adjusted width for better fit */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredTasks.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active
            ? darkMode
              ? "bg-neutral-800/50"
              : "bg-gray-200/50"
            : darkMode
              ? "bg-neutral-800/0"
              : "bg-gray-100/0"
        }`}
      >
        <AnimatePresence>
          {filteredTasks.map((t) => (
            <Card
              key={t.id}
              task={t}
              handleDragStart={handleDragStart}
              onClick={() => onTaskClick(t.id)}
              darkMode={darkMode}
            />
          ))}
        </AnimatePresence>
        <DropIndicator beforeId={null} column={column} />
        {showAddButton && (
          <button
            onClick={onAddTaskClick}
            className={`mt-2 flex w-full items-center gap-1.5 px-3 py-1.5 text-xs ${
              darkMode
                ? "text-neutral-400 hover:text-neutral-50"
                : "text-gray-600 hover:text-gray-900"
            } transition-colors`}
          >
            <span>Add task</span>
            <FiPlus />
          </button>
        )}
      </div>
    </div>
  );
};

/** Interface for Card component props */
interface CardProps {
  task: Task;
  handleDragStart: (e: React.DragEvent, task: Task) => void;
  onClick: () => void;
  darkMode: boolean;
}

/** Card Component */
const Card: React.FC<CardProps> = ({
  task,
  handleDragStart,
  onClick,
  darkMode,
}) => {
  return (
    <>
      <DropIndicator beforeId={task.id} column={task.status} />
      <motion.div
        layout
        layoutId={task.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="hover:shadow-md transition-shadow duration-200"
      >
        <div
          draggable="true"
          onDragStart={(e: React.DragEvent<HTMLDivElement>) =>
            handleDragStart(e, task)
          }
          onClick={onClick}
          className={`cursor-grab rounded border p-3 active:cursor-grabbing hover:border-opacity-80 transition-colors ${
            darkMode
              ? "border-neutral-700 bg-neutral-800 text-neutral-100 hover:bg-neutral-750"
              : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
          }`}
        >
          <p className="text-sm">{task.title}</p>
        </div>
      </motion.div>
    </>
  );
};

/** Interface for DropIndicator props */
interface DropIndicatorProps {
  beforeId: string | null;
  column: TaskStatus;
}

/** DropIndicator Component */
const DropIndicator: React.FC<DropIndicatorProps> = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

/** Interface for BurnBarrel props */
interface BurnBarrelProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onTaskDeleted: (taskId: string) => Promise<void>;
  darkMode: boolean;
}

/** BurnBarrel Component */
const BurnBarrel: React.FC<BurnBarrelProps> = ({
  setTasks,
  onTaskDeleted,
  darkMode,
}) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = async (e: React.DragEvent) => {
    const taskId = e.dataTransfer.getData("taskId");
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setActive(false);
    await onTaskDeleted(taskId);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`grid h-48 w-56 shrink-0 place-content-center rounded border text-3xl transition-colors duration-200 ${
        active
          ? darkMode
            ? "border-red-800 bg-red-800/20 text-red-500"
            : "border-red-600 bg-red-600/20 text-red-500"
          : darkMode
            ? "border-neutral-500 bg-neutral-500/20 text-neutral-500"
            : "border-gray-400 bg-gray-400/20 text-gray-400"
      }`}
    >
      {active ? (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1.1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <FaFire />
        </motion.div>
      ) : (
        <FiTrash />
      )}
    </div>
  );
};

export default Board;
