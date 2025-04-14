import { useParams } from "react-router-dom";
import { useState } from "react";
import SideBar from "../components/SideBar";
import KanbanBoard from "../components/KanbanBoard";
import Navbar from "../components/Navbar";

function DashBoard() {
  const { workspaceCode } = useParams();
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 h-screen">
        <SideBar
          selectedItem="projects"
          darkMode={true}
          workspaceCode={workspaceCode || ""}
          onProjectSelect={handleProjectSelect}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation bar */}
        <Navbar 
          workspaceCode={workspaceCode} 
        />

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <KanbanBoard projectId={selectedProjectId} />
        </main>
      </div>
    </div>
  );
}

export default DashBoard;
