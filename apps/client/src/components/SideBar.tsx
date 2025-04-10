import { useState } from "react";
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

interface SidebarProps {
  selectedItem: string;
  darkMode?: boolean;
  workspaceCode: string;
}

const projects = [
  { id: "project-a", name: "Project A" },
  { id: "project-b", name: "Project B" },
  { id: "project-c", name: "Project C" },
];

const sprints = [
  { id: "sprint-1", name: "Sprint 1 (Current)" },
  { id: "sprint-2", name: "Sprint 2 (Planning)" },
  { id: "sprint-3", name: "Sprint 3 (Backlog)" },
];

export function Sidebar({
  selectedItem,
  darkMode = true,
  workspaceCode,
}: SidebarProps) {
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [sprintsExpanded, setSprintsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Helper function to conditionally join classnames
  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

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
      <FormModal isOpen={isModalOpen} onClose={closeModal} darkMode={true} />

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
                    ? "bg-emerald-500 text-white"
                    : "hover:bg-[#2C2C2C]"
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
                    {projects.map((project) => (
                      <motion.div
                        key={project.id}
                        className={classNames(
                          "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                          selectedItem === project.id
                            ? "bg-emerald-500/20 text-emerald-500"
                            : "hover:bg-[#2C2C2C]"
                        )}
                        variants={subItemVariants}
                        whileTap={{ scale: 0.98 }}
                      >
                        {project.name}
                      </motion.div>
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
