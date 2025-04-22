import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Ban,
  Calendar,
  Plus,
  XIcon,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import RoadMapForm from "./RoadMapForm";

interface Task {
  id: string;
  title: string;
  key: string;
  status?: string; // Added status property
  priority?: string; // Added priority property
  assignee?: { id: string; name: string };
  tags?: { id: string; name: string }[];
}

interface Milestone {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: "UPCOMING" | "IN_PROGRESS" | "COMPLETED" | "AT_RISK" | "BLOCKED";
  progress: number;
  owner?: { id: string; name: string };
  dependencies?: { dependsOn: { id: string; title: string } }[];
  projectId: string;
}

interface Project {
  id: string;
  name: string;
}

interface RoadmapProps {
  workspaceName?: string;
}

const statusConfig = {
  UPCOMING: {
    color: "bg-blue-500",
    text: "text-blue-500",
    icon: <Clock className="w-4 h-4" />,
    label: "Upcoming",
  },
  IN_PROGRESS: {
    color: "bg-yellow-500",
    text: "text-yellow-500",
    icon: (
      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
          opacity=".25"
        />
        <path
          fill="currentColor"
          d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
        />
      </svg>
    ),
    label: "In Progress",
  },
  COMPLETED: {
    color: "bg-green-500",
    text: "text-green-500",
    icon: <CheckCircle2 className="w-4 h-4" />,
    label: "Completed",
  },
  AT_RISK: {
    color: "bg-orange-500",
    text: "text-orange-500",
    icon: <AlertTriangle className="w-4 h-4" />,
    label: "At Risk",
  },
  BLOCKED: {
    color: "bg-red-500",
    text: "text-red-500",
    icon: <Ban className="w-4 h-4" />,
    label: "Blocked",
  },
};

const Roadmap: React.FC<RoadmapProps> = ({ workspaceName }) => {
  console.log("Workspace name prop:", workspaceName);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [expandedMilestones, setExpandedMilestones] = useState<string[]>([]);
  const [tasksByMilestone, setTasksByMilestone] = useState<{
    [key: string]: Task[];
  }>({});
  const [loadingMilestones, setLoadingMilestones] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<
    "list" | "timeline" | "dependencies"
  >("list");
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const { getToken } = useAuth();
  const [loadingTasks, setLoadingTasks] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [error, setError] = useState<string | null>(null);
  const [taskErrors, setTaskErrors] = useState<{ [key: string]: string }>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Add this new state

  // State variables for the form
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<Milestone["status"]>("UPCOMING");
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (workspaceName) {
      const fetchProjects = async () => {
        try {
          const token = await getToken();
          if (!token) {
            throw new Error("Authentication token not available");
          }
          const response = await axios.get(
            `http://localhost:5000/api/projects/workspace/${workspaceName}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setProjects(response.data);
        } catch (err: unknown) {
          console.error("Error fetching projects:", err);
          setError("Failed to fetch projects");
        }
      };
      fetchProjects();

      const fetchAllMilestones = async () => {
        try {
          setLoadingMilestones(true);
          setError(null);
          const token = await getToken();
          if (!token) {
            throw new Error("Authentication token not found");
          }
          const response = await axios.get(
            `http://localhost:5000/api/roadmap/workspace/${workspaceName}/milestones`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setMilestones(response.data);
        } catch (err) {
          let errorMsg = "An unknown error occurred";
          if (axios.isAxiosError(err)) {
            errorMsg = err.response
              ? `Server error: ${err.response.status} - ${err.response.data?.message || "Unknown error"}`
              : "Network error: Unable to reach the server";
          } else if (err instanceof Error) {
            errorMsg = err.message;
          }
          setError(errorMsg);
        } finally {
          setLoadingMilestones(false);
        }
      };
      fetchAllMilestones();
    }
  }, [workspaceName, getToken]);

  const toggleMilestone = async (milestoneId: string) => {
    const isExpanded = expandedMilestones.includes(milestoneId);
    if (isExpanded) {
      setExpandedMilestones(
        expandedMilestones.filter((id) => id !== milestoneId)
      );
    } else {
      setExpandedMilestones([...expandedMilestones, milestoneId]);
      if (!tasksByMilestone[milestoneId]) {
        setLoadingTasks((prev) => ({ ...prev, [milestoneId]: true }));
        try {
          const authToken = await getToken();
          if (!authToken) {
            throw new Error("Authentication token not found");
          }
          const response = await axios.get(
            `http://localhost:5000/api/roadmap/milestones/${milestoneId}/tasks`,
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );
          setTasksByMilestone((prev) => ({
            ...prev,
            [milestoneId]: response.data,
          }));
        } catch (err) {
          let errorMsg = "Failed to load tasks";
          if (axios.isAxiosError(err)) {
            errorMsg = err.response
              ? `Server error: ${err.response.status} - ${err.response.data?.message || "Unknown error"}`
              : "Network error: Unable to reach the server";
          } else if (err instanceof Error) {
            errorMsg = err.message;
          }
          setTaskErrors((prev) => ({ ...prev, [milestoneId]: errorMsg }));
        } finally {
          setLoadingTasks((prev) => ({ ...prev, [milestoneId]: false }));
        }
      }
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    return `${format(new Date(startDate), "MMM d, yyyy")} - ${format(
      new Date(endDate),
      "MMM d, yyyy"
    )}`;
  };

  const handleNewMilestoneClick = () => {
    setShowCreateForm(true);
  };

  const handleCreateMilestone = async (formData: {
    title: string;
    startDate: string;
    endDate: string;
    status: string;
    progress: number;
  }) => {
    if (!selectedProjectId) {
      setError("Please select a project");
      return;
    }
    setIsSubmitting(true); // Set loading state to true before API call
    try {
      const authToken = await getToken();
      if (!authToken) {
        throw new Error("Authentication token not found");
      }
      const response = await axios.post(
        `http://localhost:5000/api/roadmap/projects/${selectedProjectId}/milestones`,
        {
          title: formData.title,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
          progress: formData.progress,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setMilestones([...milestones, response.data]);
      setShowCreateForm(false);
      setSelectedProjectId(null);
    } catch (err) {
      let errorMsg = "An unknown error occurred";
      if (axios.isAxiosError(err)) {
        errorMsg = err.response
          ? `Server error: ${err.response.status} - ${err.response.data?.message || "Unknown error"}`
          : "Network error: Unable to reach the server";
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1C1C1C] text-white rounded-lg border border-[#2C2C2C] overflow-hidden my-6 mx-4">
      {/* Header Section */}
      <div className="p-6 border-b border-[#2C2C2C] flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Roadmap</h2>
          <p className="text-sm text-gray-400">
            Long-term planning and milestone tracking
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentView("timeline")}
            className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Timeline View
          </button>
          <button
            onClick={handleNewMilestoneClick}
            className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Milestone
          </button>
        </div>
      </div>

      {/* View Options */}
      <div className="p-4 flex gap-2 border-b border-[#2C2C2C]">
        <button
          onClick={() => setCurrentView("list")}
          className={`px-3 py-1 rounded ${
            currentView === "list"
              ? "bg-[#252525] text-white"
              : "bg-[#1C1C1C] text-gray-400"
          } hover:bg-[#252525] transition-colors`}
        >
          List View
        </button>
        <button
          onClick={() => setCurrentView("timeline")}
          className={`px-3 py-1 rounded ${
            currentView === "timeline"
              ? "bg-[#252525] text-white"
              : "bg-[#1C1C1C] text-gray-400"
          } hover:bg-[#252525] transition-colors`}
        >
          Timeline View
        </button>
        <button
          onClick={() => setCurrentView("dependencies")}
          className={`px-3 py-1 rounded ${
            currentView === "dependencies"
              ? "bg-[#252525] text-white"
              : "bg-[#1C1C1C] text-gray-400"
          } hover:bg-[#252525] transition-colors`}
        >
          Dependencies
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {loadingMilestones ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        ) : !workspaceName ? (
          <div className="text-center py-8 text-gray-400">
            Select a workspace to view its roadmap.
          </div>
        ) : milestones.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No milestones found for this workspace. Click "New Milestone" to
            create one.
          </div>
        ) : (
          <div className="divide-y divide-[#2C2C2C]">
            {milestones.map((milestone) => {
              const status = statusConfig[milestone.status];
              const isExpanded = expandedMilestones.includes(milestone.id);
              const hasTasks = tasksByMilestone[milestone.id]?.length > 0;

              return (
                <div key={milestone.id} className="group">
                  <button
                    onClick={() => toggleMilestone(milestone.id)}
                    className="w-full text-left p-6 hover:bg-[#252525] transition-colors duration-150 flex flex-col gap-3"
                    aria-expanded={isExpanded}
                    aria-controls={`milestone-${milestone.id}-tasks`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {milestone.title}
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.text} bg-opacity-10`}
                          >
                            {status.icon}
                            {status.label}
                          </span>
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {formatDateRange(
                            milestone.startDate,
                            milestone.endDate
                          )}
                        </p>
                        {milestone.owner && (
                          <p className="text-sm text-gray-500">
                            Owner: {milestone.owner.name}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Project:{" "}
                          {projects.find((p) => p.id === milestone.projectId)
                            ?.name || "Unknown"}
                        </p>
                      </div>
                      <span className="text-gray-400">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-[#2C2C2C] rounded-full h-2 group-hover:bg-[#353535] transition-colors">
                      <div
                        className={`h-full rounded-full ${status.color} transition-all duration-300`}
                        style={{ width: `${milestone.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Progress</span>
                      <span>{milestone.progress}%</span>
                    </div>
                  </button>
                  <div
                    id={`milestone-${milestone.id}-tasks`}
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isExpanded
                        ? "max-h-[1000px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6 pt-2">
                      {loadingTasks[milestone.id] && isExpanded ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-emerald-500"></div>
                        </div>
                      ) : taskErrors[milestone.id] && isExpanded ? (
                        <div className="p-3 text-center text-red-500 text-sm">
                          {taskErrors[milestone.id]}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {hasTasks ? (
                            tasksByMilestone[milestone.id].map((task) => (
                              <div
                                key={task.id}
                                className="p-3 bg-[#252525] rounded-lg border border-[#2C2C2C] hover:border-[#3C3C3C] transition-colors"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">
                                    {task.title}
                                  </span>
                                  <div>
                                    <span
                                      className={`text-xs ${task.status === "DONE" ? "text-green-500" : "text-orange-500"}`}
                                    >
                                      {task.status}
                                    </span>
                                    <span
                                      className={`text-xs ml-2 ${task.priority === "HIGH" ? "text-red-500" : "text-yellow-500"}`}
                                    >
                                      {task.priority}
                                    </span>
                                  </div>
                                </div>
                                {task.assignee && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    Assigned to: {task.assignee.name}
                                  </p>
                                )}
                                {task.tags && task.tags.length > 0 && (
                                  <div className="flex gap-1 mt-1">
                                    {task.tags.map((tag) => (
                                      <span
                                        key={tag.id}
                                        className="text-xs bg-[#2C2C2C] text-gray-300 px-1.5 py-0.5 rounded"
                                      >
                                        {tag.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-center text-gray-400 text-sm">
                              No tasks found for this milestone
                            </div>
                          )}
                          {isExpanded &&
                            milestone.dependencies &&
                            milestone.dependencies.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-400">
                                  Depends on:
                                </p>
                                <ul className="list-disc list-inside text-sm text-gray-300">
                                  {milestone.dependencies.map((dep) => (
                                    <li key={dep.dependsOn.id}>
                                      {dep.dependsOn.title}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Milestone Form */}
      {showCreateForm && (
        <RoadMapForm
          projects={projects}
          title={title}
          setTitle={setTitle}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          status={status}
          setStatus={setStatus}
          progress={progress}
          setProgress={setProgress}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          error={error}
          isLoading={isSubmitting} // Pass the loading state to the form
          onClose={() => {
            setShowCreateForm(false);
            setError(null);
            setTitle("");
            setStartDate("");
            setEndDate("");
            setSelectedProjectId(null);
            setStatus("UPCOMING");
            setProgress(0);
          }}
          onSubmit={() =>
            handleCreateMilestone({
              title,
              startDate,
              endDate,
              status,
              progress,
            })
          }
        />
      )}
    </div>
  );
};

export default Roadmap;
