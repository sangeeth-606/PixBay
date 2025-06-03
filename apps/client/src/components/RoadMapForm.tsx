import { FC } from "react";
import { XIcon, AlertCircle, Loader2 } from "lucide-react";

export type MilestoneStatus =
  | "UPCOMING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "AT_RISK"
  | "BLOCKED";

interface Project {
  id: string;
  name: string;
}

interface RoadMapFormProps {
  projects: Project[];
  title: string;
  setTitle: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  status: MilestoneStatus;
  setStatus: (value: MilestoneStatus) => void;
  progress: number;
  setProgress: (value: number) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (value: string) => void;
  error: string | null;
  onClose: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
  darkMode: boolean; // Make it required by removing the question mark
}

const RoadMapForm: FC<RoadMapFormProps> = ({
  projects,
  title,
  setTitle,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  status,
  setStatus,
  progress,
  setProgress,
  selectedProjectId,
  setSelectedProjectId,
  error,
  onClose,
  onSubmit,
  isLoading = false,
  darkMode, // No default value
}) => (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="fixed inset-0 bg-black/50"></div>
    <div className="flex min-h-full items-center justify-center p-4 text-center">
      <div
        className={`w-full max-w-md transform overflow-hidden rounded-lg p-6 shadow-xl transition-all relative ${
          darkMode ? "bg-[#1C1C1C] text-white" : "bg-white text-gray-900"
        }`}
      >
        <h3
          className={`text-lg font-medium leading-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Create New Milestone
        </h3>

        {/* Close Button */}
        <button
          type="button"
          className={`absolute top-3 right-3 ${
            darkMode
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={onClose}
        >
          <XIcon className="h-6 w-6" />
        </button>

        {error && (
          <div
            className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              darkMode
                ? "bg-red-500/10 border border-red-500/20 text-red-500"
                : "bg-red-100 border border-red-200 text-red-600"
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className={`block text-sm font-medium mb-1.5 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`mt-1 block w-full px-4 py-2.5 rounded-lg border-2 shadow-sm transition-all duration-200 ease-in-out ${
                  darkMode
                    ? "bg-[#2C2C2C] border-[#333] text-white placeholder-gray-500 focus:bg-[#2C2C2C]/90"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-emerald-500/50`}
                placeholder="Enter milestone title"
                required
              />
            </div>

            {/* Date Fields - Side by side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label
                  htmlFor="startDate"
                  className={`block text-sm font-medium mb-1.5 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`mt-1 block w-full px-4 py-2.5 rounded-lg border-2 shadow-sm transition-all duration-200 ease-in-out ${
                    darkMode
                      ? "bg-[#2C2C2C] border-[#333] text-white placeholder-gray-500 focus:bg-[#2C2C2C]/90"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-emerald-500/50`}
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="endDate"
                  className={`block text-sm font-medium mb-1.5 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`mt-1 block w-full px-4 py-2.5 rounded-lg border-2 shadow-sm transition-all duration-200 ease-in-out ${
                    darkMode
                      ? "bg-[#2C2C2C] border-[#333] text-white placeholder-gray-500 focus:bg-[#2C2C2C]/90"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-emerald-500/50`}
                  required
                />
              </div>
            </div>

            {/* Status and Progress - Side by side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className={`block text-sm font-medium mb-1.5 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
                  className={`mt-1 block w-full px-4 py-2.5 rounded-lg border-2 shadow-sm transition-all duration-200 ease-in-out ${
                    darkMode
                      ? "bg-[#2C2C2C] border-[#333] text-white placeholder-gray-500 focus:bg-[#2C2C2C]/90"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-emerald-500/50`}
                  required
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="AT_RISK">At Risk</option>
                  <option value="BLOCKED">Blocked</option>
                </select>
              </div>

              {/* Progress */}
              <div>
                <label
                  htmlFor="progress"
                  className={`block text-sm font-medium mb-1.5 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Progress (%)
                </label>
                <input
                  type="number"
                  id="progress"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e) =>
                    setProgress(parseInt(e.target.value, 10) || 0)
                  }
                  className={`mt-1 block w-full px-4 py-2.5 rounded-lg border-2 shadow-sm transition-all duration-200 ease-in-out ${
                    darkMode
                      ? "bg-[#2C2C2C] border-[#333] text-white placeholder-gray-500 focus:bg-[#2C2C2C]/90"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-emerald-500/50`}
                  required
                />
              </div>
            </div>

            {/* Project Select */}
            <div>
              <label
                htmlFor="project"
                className={`block text-sm font-medium mb-1.5 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Project
              </label>
              <select
                id="project"
                value={selectedProjectId || ""}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className={`mt-1 block w-full px-4 py-2.5 rounded-lg border-2 shadow-sm transition-all duration-200 ease-in-out ${
                  darkMode
                    ? "bg-[#2C2C2C] border-[#333] text-white placeholder-gray-500 focus:bg-[#2C2C2C]/90"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-emerald-500/50`}
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-150 ease-in-out ${
                darkMode
                  ? "text-white bg-[#2C2C2C] hover:bg-[#333] border-[#333] border"
                  : "text-gray-700 bg-gray-200 hover:bg-gray-300 border-gray-300 border"
              } ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedProjectId || isLoading}
              className={`px-4 py-2 text-sm font-medium text-white bg-emerald-500 border border-transparent rounded-md shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-150 ease-in-out flex items-center justify-center min-w-[120px] ${
                !selectedProjectId || isLoading
                  ? "opacity-75 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Loading...
                </>
              ) : (
                "Create Milestone"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export default RoadMapForm;
