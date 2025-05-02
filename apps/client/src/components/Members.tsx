import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, UserCircle, Shield, Users, Plus } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { LoadingSpinner } from "./LoadingSpinner";

interface MembersProps {
  workspaceName: string;
  darkMode?: boolean;
}

interface WorkspaceMember {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  joinedAt: string;
}

interface WorkspaceDetails {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  members: WorkspaceMember[];
  projects: any[];
  memberCount: number;
  projectCount: number;
}

export function Members({ workspaceName, darkMode = true }: MembersProps) {
  const [workspaceDetails, setWorkspaceDetails] =
    useState<WorkspaceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  // Helper function to conditionally join classnames
  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  // Fetch workspace members
  const fetchWorkspaceMembers = async () => {
    if (!workspaceName) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken();
      const response = await axios.get(
        `http://localhost:5000/api/workspaces/${encodeURIComponent(workspaceName)}/members`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWorkspaceDetails(response.data);
    } catch (err: any) {
      console.error("Error fetching workspace members:", err);
      setError(
        err.response?.data?.error || "Failed to fetch workspace members"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Members component received workspace name:", workspaceName);
    fetchWorkspaceMembers();
  }, [workspaceName]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="h-4 w-4 text-emerald-500" />;
      case "MANAGER":
        return <User className="h-4 w-4 text-blue-500" />;
      default:
        return <UserCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#171717]">
        <LoadingSpinner size={30} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="rounded-full bg-red-500/20 p-3 mb-3"
        >
          <Users className="h-6 w-6 text-red-500" />
        </motion.div>
        <h3 className="text-lg font-medium text-red-500">Error</h3>
        <p className="mt-1 text-sm text-gray-400">{error}</p>
        <button
          onClick={fetchWorkspaceMembers}
          className="mt-4 rounded-md bg-[#2C2C2C] px-4 py-2 text-sm text-white hover:bg-[#3C3C3C] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#171717] text-white">
      <div className="border-b border-[#2C2C2C] p-4">
        <div className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-medium">Workspace Members</h2>
        </div>
        {workspaceDetails && (
          <p className="mt-1 text-sm text-gray-400">
            {workspaceDetails.memberCount}{" "}
            {workspaceDetails.memberCount === 1 ? "member" : "members"}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!workspaceDetails ? (
          <p className="text-gray-500 text-center py-8">
            No workspace data available
          </p>
        ) : (
          <motion.div
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {workspaceDetails.members.map((member) => (
              <motion.div
                key={member.id}
                className="flex items-center justify-between rounded-md bg-[#1F1F1F] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(44, 44, 44, 1)",
                }}
              >
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2C2C2C] text-emerald-500">
                    {member.name ? member.name[0].toUpperCase() : "?"}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">
                      {member.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-400">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span
                    className={classNames(
                      "flex items-center rounded-full px-2 py-1 text-xs",
                      member.role === "ADMIN"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : member.role === "MANAGER"
                          ? "bg-blue-500/20 text-blue-500"
                          : "bg-gray-500/20 text-gray-400"
                    )}
                  >
                    {getRoleIcon(member.role)}
                    <span className="ml-1">{member.role}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="border-t border-[#2C2C2C] p-4 flex justify-center">
        <motion.button
          className="flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="mr-1 h-4 w-4" />
          Invite New Member
        </motion.button>
      </div>
    </div>
  );
}

export default Members;
