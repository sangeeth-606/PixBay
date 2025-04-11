import React from "react";

interface ProjectInfo {
  name: string;
  progress: number;
  deadline: string;
  teamMembers: number;
}

interface ProjectInfoProps {
  project: ProjectInfo;
  darkMode: boolean;
}

const Projectinfo: React.FC<ProjectInfoProps> = ({ project, darkMode }) => {
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <div
                className={`text-base ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Team
              </div>
              <div
                className={`${darkMode ? "text-white" : "text-[#212121]"} text-lg`}
              >
                {project.teamMembers} members
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projectinfo;
