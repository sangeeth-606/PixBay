import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import KanbanBoard from "../components/KanbanBoard";
import Navbar from "../components/Navbar";
import Members from "../components/Members";
import Sprint from "../components/Sprint";
import Calendar from "./Calendar";

function DashBoard() {
  const { workspaceCode } = useParams();
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);

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

  // Render the appropriate component based on selected item
  const renderMainContent = () => {
    switch (selectedItem) {
      case "projects":
        return (
          <KanbanBoard
            projectId={selectedProjectId}
            workspaceName={workspaceCode} // Pass workspace name directly
          />
        );
      case "members":
        return <Members workspaceName={workspaceCode || ""} />;
      case "calendar":
        return <Calendar  workspaceName={workspaceCode || ""} />
      case "sprints":
        return selectedSprintId ? (
          <Sprint sprintId={selectedSprintId} />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#121212]">
            <p className="text-lg text-emerald-400 border border-emerald-700 rounded-md p-4 shadow-md bg-[#1E1E1E]">
              Select a sprint from the sidebar or create a new one
            </p>
          </div>
        );
      default:
        return (
          <div className="flex h-full items-center justify-center bg-[#121212]">
            <p className="text-lg text-emerald-400 border border-emerald-700 rounded-md p-4 shadow-md bg-[#1E1E1E]">
              Select an option from the sidebar
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#121212]">
      {/* Sidebar */}
      <div className="w-64 h-screen">
        <SideBar
          selectedItem={selectedItem}
          darkMode={true}
          workspaceCode={workspaceCode || ""}
          onProjectSelect={handleProjectSelect}
          onSprintSelect={handleSprintSelect}
          onItemSelect={handleItemSelect}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation bar */}
        <Navbar workspaceCode={workspaceCode} />

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-[#121212]">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default DashBoard;
