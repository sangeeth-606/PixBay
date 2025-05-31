import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { getApiEndpoint } from "../utils/api"; // Import the API utility function

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onProjectCreated?: () => void;
}

export function FormModal({
  isOpen,
  onClose,
  darkMode,
  onProjectCreated,
}: FormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();
  const params = useParams();

  const workspaceName = params.workspaceCode;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await getToken();
      const response = await axios.post(
        getApiEndpoint("api/projects"), // Use API utility instead of hardcoded URL
        {
          name,
          description,
          workspaceName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log("Project created:", response.data);
      onClose();
      if (onProjectCreated) {
        onProjectCreated();
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={`fixed inset-0 ${darkMode ? "bg-black/50" : "bg-black/25"}`}
          />
        </Transition.Child>

        {/* Modal Content */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full max-w-md transform overflow-hidden rounded-lg p-6 shadow-xl transition-all relative ${
                  darkMode ? "bg-[#1C1C1C]" : "bg-white"
                }`}
              >
                <Dialog.Title
                  as="h3"
                  className={`text-lg font-medium leading-6 ${
                    darkMode ? "text-white" : "text-[#212121]"
                  }`}
                >
                  Create New Project
                </Dialog.Title>

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
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className={`block text-sm font-medium mb-1.5 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`mt-1 block w-full px-4 py-2.5 rounded-lg border-2 shadow-sm 
                          transition-all duration-200 ease-in-out
                          ${
                            darkMode
                              ? "bg-[#2C2C2C] border-[#333] text-white placeholder-gray-500 focus:bg-[#2C2C2C]/90"
                              : "bg-white border-gray-200 text-[#212121] placeholder-gray-400"
                          }
                          focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                          hover:border-emerald-500/50
                          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                          disabled:bg-opacity-70 disabled:cursor-not-allowed`}
                          required
                          disabled={isLoading}
                          placeholder="Enter project name"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className={`block text-sm font-medium mb-1.5 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Description
                      </label>
                      <div className="relative">
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          className={`mt-1 block w-full px-4 py-2.5 rounded-lg border-2 shadow-sm 
                          transition-all duration-200 ease-in-out
                          ${
                            darkMode
                              ? "bg-[#2C2C2C] border-[#333] text-white placeholder-gray-500 focus:bg-[#2C2C2C]/90"
                              : "bg-white border-gray-200 text-[#212121] placeholder-gray-400"
                          }
                          focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                          hover:border-emerald-500/50
                          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                          disabled:bg-opacity-70 disabled:cursor-not-allowed
                          resize-none`}
                          required
                          disabled={isLoading}
                          placeholder="Enter project description"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-150 ease-in-out ${
                        darkMode
                          ? "text-white bg-[#2C2C2C] hover:bg-[#333] border-[#333]"
                          : "text-gray-700 bg-white hover:bg-gray-100 border-gray-300"
                      } border ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-4 py-2 text-sm font-medium text-white bg-emerald-500 border border-transparent rounded-md shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-150 ease-in-out flex items-center ${
                        isLoading ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        "Create Project"
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
