import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  Inbox,
  FolderKanban,
  ChevronDown,
  ChevronRight,
  Settings,
  GitPullRequest,
  BarChart2,
  Plus,
} from "lucide-react";
import { FormModal } from "./FormModal";
import { SprintFormModal } from "./SprintFormModal";
import { LoadingSpinner } from "./LoadingSpinner";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  selectedItem: string;
  darkMode?: boolean;
  workspaceCode: string;
  onProjectCreated?: () => void;
  onProjectSelect: (projectId: string) => void;
  onSprintSelect: (sprintId: string) => void; // Added parameter here
  onItemSelect: (item: string) => void;
}
interface Project {
  id: string;
  name: string;
  workspaceId: string;
}

interface Sprint {
  id: string;
  name: string;
  status: string;
  projectId: string;
  project?: { name: string };
}

export function Sidebar({
  selectedItem,
  darkMode = true,
  workspaceCode,
  onProjectSelect,
  onSprintSelect, // Added parameter here
  onItemSelect,
}: SidebarProps) {
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [sprintsExpanded, setSprintsExpanded] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [project, setProject] = useState<Project[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSprintsLoading, setIsSprintsLoading] = useState(false);
  const navigate = useNavigate();

  const { getToken } = useAuth();

  const openProjectModal = () => setIsProjectModalOpen(true);
  const closeProjectModal = () => setIsProjectModalOpen(false);

  const openSprintModal = () => {
    setIsSprintModalOpen(true);
  };
  const closeSprintModal = () => setIsSprintModalOpen(false);

  // Helper function to conditionally join classnames
  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  const getProjects = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(
        `http://localhost:5000/api/projects/workspace/${workspaceCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const projects = response.data;
      setProject(projects);

      // Only auto-select if we're in the same workspace
      const currentProjectId = new URLSearchParams(window.location.search).get(
        "projectId"
      );
      if (projects.length > 0 && !currentProjectId) {
        console.log("Auto-selecting first project:", projects[0].id);
        handleProjectSelect(projects[0].id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSprints = async () => {
    if (!workspaceCode) return;

    setIsSprintsLoading(true);
    try {
      const token = await getToken();

      // Ensure the workspace ID is properly encoded for the URL
      const encodedWorkspaceId = encodeURIComponent(workspaceCode);
      console.log(`Fetching sprints for workspace: ${encodedWorkspaceId}`);

      // Make sure any + signs are properly handled (+ represents a space in URL encoding)
      const url = `http://localhost:5000/api/sprints/workspace/${encodedWorkspaceId}`;
      console.log(`Making API request to: ${url}`);

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(`Successfully fetched ${response.data.length} sprints`);
      setSprints(response.data);
    } catch (error) {
      console.error("Error fetching sprints:", error);
      // Handle the error gracefully
      setSprints([]);

      // Add better error details
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          `Server responded with status ${error.response.status}:`,
          error.response.data
        );
      }
    } finally {
      setIsSprintsLoading(false);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    navigate(`?projectId=${projectId}`);
    onProjectSelect(projectId);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const projectIdFromUrl = url.searchParams.get("projectId");

    if (projectIdFromUrl) {
      console.log("Found project ID in URL:", projectIdFromUrl);
      onProjectSelect(projectIdFromUrl);
    }
  }, []);

  useEffect(() => {
    getProjects();
    getSprints();
  }, [workspaceCode]);

  // Refresh sprints when a new sprint is created
  useEffect(() => {
    if (!isSprintModalOpen) {
      getSprints();
    }
  }, [isSprintModalOpen]);

  // Animation variants
  const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  const subMenuVariants = {
    closed: { height: 0, opacity: 0, overflow: "hidden" },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  const subItemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <>
      <FormModal
        isOpen={isProjectModalOpen}
        onClose={closeProjectModal}
        darkMode={true}
        onProjectCreated={getProjects}
      />

      <SprintFormModal
        isOpen={isSprintModalOpen}
        onClose={closeSprintModal}
        darkMode={true}
        workspaceName={workspaceCode}
        onSprintCreated={() => getSprints()}
      />

      <motion.div
        className="flex h-full w-64 flex-col bg-[#171717] text-white "
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {/* Projects section */}
            <div>
              <motion.div
                className={classNames(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  selectedItem === "projects"
                    ? "bg-[#00875A] text-white hover:bg-[#006644] shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_0_2px_0_rgba(255,255,255,0.1)]"
                    : "hover:bg-[#2C2C2C] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_1px_0_rgba(255,255,255,0.05)]"
                )}
                onClick={() => {
                  setProjectsExpanded(!projectsExpanded);
                  onItemSelect("projects");
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
                initial="initial"
                animate="animate"
              >
                <div className="flex items-center">
                  <motion.div
                    whileHover={{
                      rotate: selectedItem === "projects" ? 0 : 15,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <FolderKanban className="mr-2 h-4 w-4" />
                  </motion.div>
                  <span>Projects</span>
                </div>
                <motion.div
                  animate={{ rotate: projectsExpanded ? 0 : -90 }}
                  transition={{ duration: 0.3 }}
                >
                  {projectsExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </motion.div>
              </motion.div>

              <AnimatePresence>
                {projectsExpanded && (
                  <motion.div
                    className="ml-6 mt-1 space-y-1"
                    variants={subMenuVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    {isLoading ? (
                      <LoadingSpinner size={20} />
                    ) : (
                      <>
                        {project.map((proj) => (
                          <motion.button
                            key={proj.id}
                            onClick={() => {
                              console.log("Project ID:", proj.id);
                              handleProjectSelect(proj.id);
                            }}
                            className={classNames(
                              "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                              selectedItem === proj.id
                                ? "bg-emerald-500/20 text-emerald-500"
                                : "hover:bg-[#2C2C2C]"
                            )}
                            variants={subItemVariants}
                            whileTap={{ scale: 0.98 }}
                          >
                            {proj.name}
                          </motion.button>
                        ))}
                        {!isProjectModalOpen && (
                          <motion.div
                            className="w-full rounded-md px-3 py-2 text-left text-sm text-emerald-500 flex items-center gap-2 hover:bg-[#2C2C2C]"
                            variants={subItemVariants}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Plus size={16} />
                            <button onClick={openProjectModal}>
                              Add Project
                            </button>
                          </motion.div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sprints section */}
            <div>
              <motion.button
                className={classNames(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  selectedItem === "sprints"
                    ? "bg-emerald-500 text-white"
                    : "hover:bg-[#2C2C2C]"
                )}
                onClick={() => {
                  setSprintsExpanded(!sprintsExpanded);
                  onItemSelect("sprints");
                }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
                initial="initial"
                animate="animate"
              >
                <div className="flex items-center">
                  <motion.div
                    whileHover={{ rotate: selectedItem === "sprints" ? 0 : 15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <GitPullRequest className="mr-2 h-4 w-4" />
                  </motion.div>
                  <span>Sprints</span>
                </div>
                <motion.div
                  animate={{ rotate: sprintsExpanded ? 0 : -90 }}
                  transition={{ duration: 0.3 }}
                >
                  {sprintsExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {sprintsExpanded && (
                  <motion.div
                    className="ml-6 mt-1 space-y-1"
                    variants={subMenuVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    {isSprintsLoading ? (
                      <LoadingSpinner size={20} />
                    ) : (
                      <>
                        {sprints.length > 0 ? (
                          sprints.map((sprint) => (
                            <motion.button
                              key={sprint.id}
                              className={classNames(
                                "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                                selectedItem === sprint.id
                                  ? "bg-emerald-500/20 text-emerald-500"
                                  : "hover:bg-[#2C2C2C]"
                              )}
                              variants={subItemVariants}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                onSprintSelect(sprint.id); // Use the onSprintSelect prop
                                onItemSelect("sprints");
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span>{sprint.name}</span>
                                {sprint.status && (
                                  <span className="text-xs opacity-70">
                                    ({sprint.status.toLowerCase()})
                                  </span>
                                )}
                              </div>
                              {sprint.project && (
                                <div className="mt-1 text-xs opacity-60">
                                  {sprint.project.name}
                                </div>
                              )}
                            </motion.button>
                          ))
                        ) : (
                          <div className="text-sm text-gray-400 px-3 py-2">
                            No sprints found
                          </div>
                        )}
                        <motion.button
                          className="w-full rounded-md px-3 py-2 text-left text-sm text-emerald-500 flex items-center gap-2 hover:bg-[#2C2C2C]"
                          variants={subItemVariants}
                          whileTap={{ scale: 0.95 }}
                          onClick={openSprintModal}
                        >
                          <Plus size={16} />
                          <span>Add Sprint</span>
                        </motion.button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Roadmap */}
            <motion.button
              className={classNames(
                "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                selectedItem === "roadmap"
                  ? "bg-emerald-500 text-white"
                  : "hover:bg-[#2C2C2C]"
              )}
              onClick={() => onItemSelect("roadmap")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div
                whileHover={{ rotate: selectedItem === "roadmap" ? 0 : 15 }}
                transition={{ duration: 0.2 }}
              >
                <BarChart2 className="mr-2 h-4 w-4" />
              </motion.div>
              <span>Roadmap</span>
            </motion.button>

            {/* Calendar */}
            <motion.button
              className={classNames(
                "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                selectedItem === "calendar"
                  ? "bg-emerald-500 text-white"
                  : "hover:bg-[#2C2C2C]"
              )}
              onClick={() => onItemSelect("calendar")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div
                whileHover={{ rotate: selectedItem === "calendar" ? 0 : 15 }}
                transition={{ duration: 0.2 }}
              >
                <Calendar className="mr-2 h-4 w-4" />
              </motion.div>
              <span>Calendar</span>
            </motion.button>

            {/* Members */}
            <motion.button
              className={classNames(
                "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                selectedItem === "members"
                  ? "bg-emerald-500 text-white"
                  : "hover:bg-[#2C2C2C]"
              )}
              onClick={() => onItemSelect("members")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div
                whileHover={{ rotate: selectedItem === "members" ? 0 : 15 }}
                transition={{ duration: 0.2 }}
              >
                <Users className="mr-2 h-4 w-4" />
              </motion.div>
              <span>Members</span>
            </motion.button>

            {/* Inbox */}
            <motion.button
              className={classNames(
                "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                selectedItem === "inbox"
                  ? "bg-emerald-500 text-white"
                  : "hover:bg-[#2C2C2C]"
              )}
              onClick={() => onItemSelect("inbox")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div
                whileHover={{ rotate: selectedItem === "inbox" ? 0 : 15 }}
                transition={{ duration: 0.2 }}
              >
                <Inbox className="mr-2 h-4 w-4" />
              </motion.div>
              <span>Inbox</span>
            </motion.button>
          </nav>
        </div>

        {/* Settings button at bottom */}
        <div className="p-4 border-t border-[#2C2C2C]">
          <motion.button
            className={classNames(
              "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
              selectedItem === "settings"
                ? "bg-emerald-500 text-white"
                : "hover:bg-[#2C2C2C]"
            )}
            onClick={() => onItemSelect("settings")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <Settings className="mr-2 h-4 w-4" />
            </motion.div>
            <span>Settings</span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

export default Sidebar;
