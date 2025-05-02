import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import KanbanBoard from "../components/KanbanBoard";
import Navbar from "../components/Navbar";
import Members from "../components/Members";
import Sprint from "../components/Sprint";
import Calendar from "./Calendar";
import Roadmap from "../components/Roadmap";
import Inbox from "../components/Inbox";
import ChatRoom from "../components/ChatRoom";
import { JoinCallButton } from "../components/VideoButton";
import { useUser } from "@clerk/clerk-react";

function DashBoard() {
  const { workspaceCode } = useParams();
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const { user } = useUser();

  const email = user?.emailAddresses?.[0]?.emailAddress || null;
  console.log("dashBo", email);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You could also save this preference to localStorage here
  };

  // Reset project selection when workspace changes
  useEffect(() => {
    setSelectedProjectId(null);
    setSelectedSprintId(null);
    setSelectedItem("");
  }, [workspaceCode]);

  // Handle item selection from sidebar
  const handleItemSelect = (itemKey: string) => {
    console.log("Dashboard setting selected item to:", itemKey);
    setSelectedItem(itemKey);
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedItem("projects"); // Switch to projects view when a project is selected
  };

  const handleSprintSelect = (sprintId: string) => {
    setSelectedSprintId(sprintId);
    setSelectedItem("sprints"); // Switch to sprints view when a sprint is selected
  };

  // Add this to debug which content is being rendered
  useEffect(() => {
    console.log("Current selected item:", selectedItem);
  }, [selectedItem]);

  const handleCloseChatRoom = () => {
    setSelectedItem("");
  };

  const renderMainContent = () => {
    switch (selectedItem) {
      case "projects":
        return (
          <KanbanBoard
            projectId={selectedProjectId}
            workspaceName={workspaceCode} // Pass workspace name directly
            darkMode={darkMode} // Pass darkMode to KanbanBoard
          />
        );
      case "members":
        return <Members workspaceName={workspaceCode || ""} />;
      case "calendar":
        return <Calendar  darkMode={darkMode} workspaceName={workspaceCode || ""} />;
      case "roadmap":
        return <Roadmap  darkMode={darkMode} workspaceName={workspaceCode || ""} />;
      case "inbox":
        return <Inbox />;
      case "messages":
        return (
          <div className="h-full w-full flex">
            <div
              className={`w-[32rem] ${
                darkMode
                  ? "bg-[#1E1E1E] border-emerald-700"
                  : "bg-gray-50 border-emerald-300"
              } border-r`}
            >
              <ChatRoom
                roomCode={workspaceCode || "general"}
                userId={email || "anonymous"}
                onClose={handleCloseChatRoom}
              />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent relative overflow-hidden animate-pulse transform transition-all duration-1000 animate-bounce">
                <span className="relative z-10 inline-block animate-pulse">
                  Hey
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 opacity-50 animate-pulse blur-md"></span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-300 animate-[gradient_3s_ease-in-out_infinite] origin-left"></span>
              </p>
            </div>
          </div>
        );
      case "sprints":
        return selectedSprintId ? (
          <Sprint sprintId={selectedSprintId} darkMode={darkMode} /> // Pass darkMode prop
        ) : (
          <div
            className={`flex h-full items-center justify-center ${
              darkMode ? "bg-[#121212]" : "bg-gray-50"
            }`}
          >
            <p
              className={`text-lg ${
                darkMode
                  ? "text-emerald-400 border-emerald-700 bg-[#1E1E1E]"
                  : "text-emerald-600 border-emerald-300 bg-white"
              } border rounded-md p-4 shadow-md`}
            >
              Select a sprint from the sidebar or create a new one
            </p>
          </div>
        );
      default:
        return (
          <div
            className={`flex h-full items-center justify-center ${
              darkMode ? "bg-[#121212]" : "bg-gray-50"
            }`}
          >
            <p
              className={`text-lg ${
                darkMode
                  ? "text-emerald-400 border-emerald-700 bg-[#1E1E1E]"
                  : "text-emerald-600 border-emerald-300 bg-white"
              } border rounded-md p-4 shadow-md`}
            >
              Select an option from the sidebar
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-[#121212]" : "bg-gray-50"}`}>
      {/* Sidebar */}
      <div className="w-64 h-screen">
        <SideBar
          selectedItem={selectedItem}
          darkMode={darkMode}
          workspaceCode={workspaceCode || ""}
          onProjectSelect={handleProjectSelect}
          onSprintSelect={handleSprintSelect}
          onItemSelect={handleItemSelect}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation bar */}
        <Navbar
          workspaceCode={workspaceCode}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* Main content */}
        <main
          className={`flex-1 overflow-auto ${
            darkMode ? "bg-[#121212]" : "bg-gray-50"
          } relative`}
        >
          {renderMainContent()}
          <div className="absolute bottom-4 right-4 z-50">
            <JoinCallButton
              roomCode={workspaceCode || "general"}
              userId={email || "anonymous"}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashBoard;
