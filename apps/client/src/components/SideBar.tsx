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
import { LoadingSpinner } from "./LoadingSpinner";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

interface SidebarProps {
  selectedItem: string;
  darkMode?: boolean;
  workspaceCode: string;
  onProjectCreated?: () => void; // Add this line
  onProjectSelect: (projectId: string) => void;
}
interface Project {
  id: string;
  name: string;
  workspaceId: string;
}

const sprints = [
  { id: "sprint-1", name: "Sprint 1 (Current)" },
  { id: "sprint-2", name: "Sprint 2 (Planning)" },
  { id: "sprint-3", name: "Sprint 3 (Backlog)" },
];

export function Sidebar({
  selectedItem,
  darkMode = true,
  workspaceCode,
  onProjectSelect,
}: SidebarProps) {
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [sprintsExpanded, setSprintsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [project, setProject] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getToken } = useAuth();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Helper function to conditionally join classnames
  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  const getProjects = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(
        "http://localhost:5000/api/projects/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProject(response.data);
      console.log("usestate projects data", project);
      console.log("get products data", response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add function to update URL with query parameters
  const handleProjectSelect = (projectId: string) => {
    // Update URL with project ID as query parameter without reloading the page
    const url = new URL(window.location.href);
    url.searchParams.set("projectId", projectId);
    window.history.pushState({ projectId }, "", url);

    // Call the callback to update the state in parent component
    onProjectSelect(projectId);
  };

  // Check for projectId in URL when component mounts
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
  }, []);
  console.log("usestate projects data", project);

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
        isOpen={isModalOpen}
        onClose={closeModal}
        darkMode={true}
        onProjectCreated={getProjects} // Pass the getProjects function as callback
      />

      <motion.div
        className="flex h-full w-64 flex-col bg-[#171717] text-white rounded-r-lg"
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
                              handleProjectSelect(proj.id); // Use new function instead of direct callback
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
                        {!isModalOpen && (
                          <motion.div
                            className="w-full rounded-md px-3 py-2 text-left text-sm text-emerald-500 flex items-center gap-2 hover:bg-[#2C2C2C]"
                            variants={subItemVariants}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Plus size={16} />
                            <button onClick={openModal}>Add Project</button>
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
                    {sprints.map((sprint) => (
                      <motion.button
                        key={sprint.id}
                        className={classNames(
                          "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                          selectedItem === sprint.id
                            ? "bg-emerald-500/20 text-emerald-500"
                            : "hover:bg-[#2C2C2C]"
                        )}
                        variants={subItemVariants}
                        //   whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {sprint.name}
                      </motion.button>
                    ))}
                    <motion.button
                      className="w-full rounded-md px-3 py-2 text-left text-sm text-emerald-500 flex items-center gap-2 hover:bg-[#2C2C2C]"
                      variants={subItemVariants}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={16} />
                      <span>Add Sprint</span>
                    </motion.button>
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
