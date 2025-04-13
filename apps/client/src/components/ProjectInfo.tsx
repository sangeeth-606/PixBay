import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

interface ProjectInfo {
  name: string;
  description: string;
  status: string;
  progress: number;
  deadline?: string; // Optional since it might not be in the API
  teamMembers?: number; // Optional since it might not be in the API
}

interface ProjectInfoProps {
  darkMode: boolean;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ darkMode }) => {
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const { getToken } = useAuth();

  console.log("Component rendered, projectId:", projectId);

  useEffect(() => {
    const fetchProjectInfo = async () => {
      console.log("Fetching project info for projectId:", projectId);
      try {
        if (!projectId) {
          throw new Error("Project ID is missing");
        }

        setLoading(true);
        const token = await getToken();
      

        const projectUrl = `http://localhost:5000/api/projects/${projectId}`;
        console.log("Fetching from endpoint:", projectUrl);

        const response = await axios.get(projectUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API response received:", response.status, response.statusText);
        console.log("Project data:", response.data);

        // Set default values for missing fields
        const projectData = {
          ...response.data,
          status: response.data.status || "active",
          progress: response.data.progress || 0,
        };

        setProject(projectData);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching project details:");
        console.error("Error message:", err.message);
        console.error("Error response:", err.response?.data);
        console.error("Status code:", err.response?.status);

        console.error("Project ID type:", typeof projectId);
        console.error("Project ID value:", projectId);

        let errorMessage = "Failed to load project information";
        if (err.response) {
          errorMessage += ` (${err.response.status}: ${err.response.statusText})`;
          if (err.response.status === 404) {
            errorMessage = "Create a Project ";
          } else if (err.response.status === 401 || err.response.status === 403) {
            errorMessage = "You don’t have permission to view this project.";
          }
        } else if (err.request) {
          errorMessage += " (No response received from server. Is the backend running?)";
        } else {
          errorMessage += ` (${err.message})`;
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectInfo();
    } else {
      console.error("No projectId found in query parameters");
      setError("select a project or create a new ");
      setLoading(false);
    }
  }, [projectId, getToken]);

  console.log("Component state:", { loading, error, project });

  if (loading) {
    return (
      <div
        className={`rounded-lg shadow-md p-8 ${
          darkMode ? "bg-[#171717] border border-[#2C2C2C]" : "bg-gray-100"
        }`}
      >
        <p className={`text-center ${darkMode ? "text-white" : "text-[#212121]"}`}>
          Loading project information...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={`rounded-lg shadow-md p-8 ${
        darkMode ? "bg-[#171717] border border-[#2C2C2C]" : "bg-gray-100"
      }`}>
        <p className={`text-center text-red-500`}>{error || "Project not found"}</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg shadow-md ${
        darkMode ? "bg-[#171717] border border-[#2C2C2C]" : "bg-gray-100"
      }`}
    >
      <div className="p-8">
        <h1
          className={`text-2xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-[#212121]"
          }`}
        >
          {project.name}
        </h1>

        {project.description && (
          <div className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <p>{project.description}</p>
          </div>
        )}

        <div className="flex justify-between items-center px-12">
          <div className="flex items-center">
            <div className="relative w-16 h-16">
              <div
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${
                  darkMode ? "border-[#2C2C2C]" : "border-gray-300"
                }`}
              >
                <div className="text-emerald-400 font-semibold text-lg">
                  {project.progress}%
                </div>
              </div>
              <svg
                className="absolute top-0 left-0 w-16 h-16"
                viewBox="0 0 44 44"
              >
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke={darkMode ? "#2c2c2c" : "#e5e5e5"}
                  strokeWidth="4"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray={`${(project.progress / 100) * 113} 113`}
                  strokeLinecap="round"
                  transform="rotate(-90 22 22)"
                />
              </svg>
            </div>
            <div className="ml-4">
              <div
                className={`text-base ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Progress
              </div>
              <div
                className={`${darkMode ? "text-white" : "text-[#212121]"} text-lg`}
              >
                {project.progress}%
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"
              }`}
            >
              <svg
                className="w-6 h-6 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <div
                className={`text-base ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Status
              </div>
              <div
                className={`${darkMode ? "text-white" : "text-[#212121]"} text-lg capitalize`}
              >
                {project.status}
              </div>
            </div>
          </div>

          {project.deadline && (
            <div className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"
                }`}
              >
                <svg
                  className="w-6 h-6 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div className="ml-4">
                <div
                  className={`text-base ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Deadline
                </div>
                <div
                  className={`${darkMode ? "text-white" : "text-[#212121]"} text-lg`}
                >
                  {project.deadline}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
