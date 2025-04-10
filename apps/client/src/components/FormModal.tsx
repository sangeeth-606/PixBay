import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export function FormModal({ isOpen, onClose, darkMode }: FormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { getToken } = useAuth();
  const params= useParams()
  // const [error, setError] = useState<string | null>(null);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const workspaceName = params.workspaceCode;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("sending data",  workspaceName);
      const token = await getToken();
      const response = await axios.post(
        "http://localhost:5000/api/projects/create",
        {
          name,
          description,
          workspaceName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Project created:", response.data);
      // You might want to trigger a refresh of projects or show a success notification

      onClose();
    } catch (error) {
      console.error("Failed to create project:", error);
      // You might want to show an error message to the user
      // For example, using a toast notification or setting an error state
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
                  Create New Item
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
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`mt-1 block w-full rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm ${
                          darkMode
                            ? "bg-[#2C2C2C] border-[#333] text-white"
                            : "border-gray-300 bg-white text-[#212121]"
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className={`mt-1 block w-full rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm ${
                          darkMode
                            ? "bg-[#2C2C2C] border-[#333] text-white"
                            : "border-gray-300 bg-white text-[#212121]"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        darkMode
                          ? "text-white bg-[#2C2C2C] hover:bg-[#333] border-[#333]"
                          : "text-gray-700 bg-white hover:bg-gray-100 border-gray-300"
                      } border`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 border border-transparent rounded-md shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      Submit
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
