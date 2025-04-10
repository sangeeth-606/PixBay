import { useParams } from "react-router-dom";
import { useState } from "react";
import { Menu, Bell, Search, User, Settings } from "lucide-react";
import SideBar from "../components/SideBar";

function DashBoard() {
  const { workspaceCode } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? "w-20" : "w-64"} transition-all duration-300 h-screen`}>
      <SideBar selectedItem="projects" darkMode={true} workspaceCode={workspaceCode || "" } />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation bar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 py-2">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-md hover:bg-gray-100 mr-4"
            >
              <Menu size={20} />
              
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-md font-mono">
                    {workspaceCode || "No workspace code provided"}
                  </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-md hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
              <User size={18} />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Workspace header */}
            
            
            {/* Dashboard widgets */}
            
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashBoard;