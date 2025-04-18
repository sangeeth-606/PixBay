
import React, { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

// Type definitions based on the schema
type SprintStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "ARCHIVED";
type TaskType = "TASK" | "BUG" | "STORY" | "EPIC";
type Priority = "HIGH" | "MEDIUM" | "LOW";

interface Task {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  priority: Priority;
  storyPoints: number | null;
  assignee?: { id: string; name: string };
}

interface Sprint {
  id: string;
  name: string;
  goal?: string | null;
  status: SprintStatus;
  startDate: string;
  endDate: string;
  progress: number;
  tasks: Task[];
  project: { id: string; key: string };
  owner: { id: string; name: string };
}

interface SprintProps {
  sprintId: string;
}

const Sprint: React.FC<SprintProps> = ({ sprintId }) => {
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSprint = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/sprints/${sprintId}`);
        const data = response.data;
        console.log("Fetched sprint data:", data);
        const parsedSprint = {
          ...data,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
        };
        setSprint(parsedSprint);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("API error:", err.response?.data || err.message);
          setError(err.response?.data?.error || err.message);
        } else {
          console.error("Unexpected error:", err);
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSprint();
  }, [sprintId]);

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (error) return <div className="text-red-500 p-6">Error: {error}</div>;
  if (!sprint) return <div className="text-white p-6">Sprint not found</div>;

  const totalStoryPoints = sprint.tasks?.reduce(
    (sum, task) => sum + (task.storyPoints || 0),
    0
  ) || 0;
  const completedStoryPoints = sprint.tasks
    ?.filter((task) => task.status === "DONE")
    .reduce((sum, task) => sum + (task.storyPoints || 0), 0) || 0;

  const taskCounts = {
    todo: sprint.tasks?.filter((task) => task.status === "TODO").length || 0,
    inProgress: sprint.tasks?.filter((task) => task.status === "IN_PROGRESS").length || 0,
    done: sprint.tasks?.filter((task) => task.status === "DONE").length || 0,
  };

  const calculateTimeElapsed = (start: Date, end: Date) => {
    const now = new Date();
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    if (totalDuration <= 0) return 0;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name: string): string => {
    const names = name.split(" ");
    return names.map((n) => n[0]).join("").toUpperCase();
  };

  const getStatusBadgeClass = (status: SprintStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500 text-white";
      case "PLANNING":
        return "bg-blue-500 text-white";
      case "COMPLETED":
        return "bg-green-500 text-white";
      case "CANCELLED":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getPriorityBadgeClass = (priority: Priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500 text-white";
      case "MEDIUM":
        return "bg-yellow-500 text-white";
      case "LOW":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusClass = (status: TaskStatus) => {
    switch (status) {
      case "TODO":
        return "bg-gray-200 text-gray-800";
      case "IN_PROGRESS":
        return "bg-blue-200 text-blue-800";
      case "DONE":
        return "bg-emerald-200 text-emerald-800";
      case "ARCHIVED":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="bg-[#171717] text-white p-6 rounded-md w-full"
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{sprint.name} - {sprint.project.key}</h1>
          <h2 className="text-sm text-gray-400">Owned by: {sprint.owner.name}</h2>
          <div className="flex items-center mt-1">
            <span
              className={`text-xs px-2 py-1 rounded-md mr-2 ${getStatusBadgeClass(sprint.status)}`}
            >
              {sprint.status}
            </span>
            <span className="text-sm text-gray-400 flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" />
              {formatDate(new Date(sprint.startDate))} - {formatDate(new Date(sprint.endDate))}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            className="px-4 py-2 rounded-md bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Edit Sprint
          </motion.button>
          <motion.button
            className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {sprint.status === "PLANNING" ? "Start Sprint" : "Complete Sprint"}
          </motion.button>
        </div>
      </div>

      <motion.div
        className="bg-[#2C2C2C] p-6 rounded-md mb-6 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_1px_0_rgba(255,255,255,0.05)]"
        variants={itemVariants}
      >
        <h2 className="text-lg font-semibold mb-2">Sprint Goal</h2>
        <p className="text-gray-300">
          {sprint.goal || "No goal set for this sprint"}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          className="bg-[#2C2C2C] p-6 rounded-md shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_1px_0_rgba(255,255,255,0.05)]"
          variants={itemVariants}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-2">Progress</h3>
          <div className="w-full bg-[#171717] rounded-full h-2 mb-2">
            <div
              className="bg-emerald-500 h-2 rounded-full"
              style={{ width: `${sprint.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span>{sprint.progress}% complete</span>
            <span>
              {Math.round(calculateTimeElapsed(new Date(sprint.startDate), new Date(sprint.endDate)))}% time elapsed
            </span>
          </div>
        </motion.div>

        <motion.div
          className="bg-[#2C2C2C] p-6 rounded-md shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_1px_0_rgba(255,255,255,0.05)]"
          variants={itemVariants}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-2">Story Points</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold mr-2">{completedStoryPoints}</span>
            <span className="text-gray-400">/ {totalStoryPoints}</span>
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {totalStoryPoints > 0
              ? Math.round((completedStoryPoints / totalStoryPoints) * 100)
              : 0}
            % completed
          </div>
        </motion.div>

        <motion.div
          className="bg-[#2C2C2C] p-6 rounded-md shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_1px_0_rgba(255,255,255,0.05)]"
          variants={itemVariants}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-2">Issues</h3>
          <div className="flex justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold">{taskCounts.todo}</div>
              <div className="text-sm text-gray-400">To Do</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{taskCounts.inProgress}</div>
              <div className="text-sm text-gray-400">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{taskCounts.done}</div>
              <div className="text-sm text-gray-400">Done</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 border-b border-[#2C2C2C]">
          <motion.button
            className="px-4 py-2 border-b-2 border-emerald-500 font-medium"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            Issues
          </motion.button>
          <motion.button
            className="px-4 py-2 text-gray-400 hover:text-white"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            Burndown Chart
          </motion.button>
          <motion.button
            className="px-4 py-2 text-gray-400 hover:text-white"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            Board
          </motion.button>
        </div>
      </div>

      <motion.div className="overflow-x-auto" variants={itemVariants}>
        <table className="min-w-full bg-[#2C2C2C] rounded-md shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_1px_0_rgba(255,255,255,0.05)]">
          <thead>
            <tr className="text-left text-gray-400 text-sm">
              <th className="py-3 px-4">Key</th>
              <th className="py-3 px-4">Summary</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assignee</th>
              <th className="py-3 px-4">Story Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3C3C3C]">
            {sprint.tasks?.map((task) => (
              <motion.tr
                key={task.id}
                className="hover:bg-[#3C3C3C] transition-colors"
                whileHover={{ backgroundColor: "#3C3C3C" }}
              >
                <td className="py-3 px-4 font-medium">{task.id}</td>
                <td className="py-3 px-4">{task.title}</td>
                <td className="py-3 px-4">
                  <span className="flex items-center text-gray-400">
                    <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                    {task.type}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-md ${getPriorityBadgeClass(task.priority)}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-md ${getStatusClass(task.status)}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {task.assignee && (
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-[#3C3C3C] rounded-full flex items-center justify-center text-xs mr-2">
                        {getInitials(task.assignee.name)}
                      </span>
                      <span>{task.assignee.name}</span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {task.storyPoints ?? "-"}
                </td>
              </motion.tr>
            )) || (
              <tr>
                <td colSpan={7} className="py-3 px-4 text-center text-gray-400">
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default Sprint;