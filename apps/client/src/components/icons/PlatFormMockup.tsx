import { Video, Users, Clipboard, Bell } from "lucide-react";
import { useState, useEffect } from "react";

interface PlatFormMockupProps {
  darkMode?: boolean;
}

const PlatFormMockup = ({ darkMode = false }: PlatFormMockupProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl p-6 relative"> {/* Slightly increased max width */}
      {/* Browser Header */}
      <div
        className={`w-full mb-6 flex items-center justify-between ${
          darkMode
            ? "bg-[#1C1C1C] border border-[#2C2C2C]"
            : "bg-gray-100 border border-gray-200"
        } p-4 rounded-lg transition-all duration-500 ${
          isLoaded ? "opacity-100" : "opacity-80"
        }`}
      >
        {/* Traffic Lights */}
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-sm cursor-pointer"></div>
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-sm cursor-pointer"></div>
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm cursor-pointer"></div>
        </div>

        {/* URL Bar */}
        <div
          className={`flex-1 mx-8 px-6 py-3 rounded-lg text-base font-mono ${
            darkMode
              ? "bg-[#0f0f0f] text-gray-300 border border-gray-700"
              : "bg-white text-gray-600 border border-gray-300"
          }`}
        >
          <span className="text-emerald-500">🔒</span>
          <span className="ml-2">pixbay.space/workspace/xyz-1234</span>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-6">
          <Video size={22} className="text-emerald-500 cursor-pointer" />
          <Users size={22} className={darkMode ? "text-gray-400" : "text-gray-600"} />
          <Bell size={22} className={darkMode ? "text-gray-400" : "text-gray-600"} />
          <Clipboard size={22} className="text-emerald-500 cursor-pointer" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full h-56 gap-6">
        {/* Sidebar */}
        <div className={`w-1/3 rounded-lg p-4 ${darkMode ? "bg-[#1C1C1C]" : "bg-gray-100"}`}> {/* Slightly increased width */}
          {/* Sidebar Header */}
          <div className="w-full h-8 mb-4 rounded-md bg-emerald-500 bg-opacity-20"></div>

          {/* Sidebar Items */}
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className={`w-full h-6 mb-3 rounded-md ${darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"}`}
            >
              <div className="h-full w-3 rounded-l-md bg-transparent"></div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className={`flex-1 rounded-lg p-4 ${darkMode ? "bg-[#1C1C1C]" : "bg-gray-100"}`}> {/* Slightly increased padding */}
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className={`w-1/2 h-8 rounded-md ${darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"}`}></div>
            <div className="w-28 h-8 rounded-md bg-emerald-500 bg-opacity-30"></div>
          </div>

          {/* Kanban Board */}
          <div className="flex gap-4 h-44">
            {[0, 1, 2].map((col) => (
              <div
                key={col}
                className={`flex-1 rounded-md p-3 ${darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"}`}
              >
                {/* Column Header */}
                <div className={`w-full h-6 mb-3 rounded-sm ${darkMode ? "bg-[#333]" : "bg-gray-300"}`}></div>

                {/* Kanban Cards */}
                <div className="w-full h-24 rounded-sm bg-emerald-500 bg-opacity-30 relative overflow-hidden">
                  {/* Task lines */}
                  <div className={`absolute top-3 left-3 right-3 h-1.5 rounded-full ${darkMode ? "bg-gray-600" : "bg-gray-400"}`}></div>
                  <div className={`absolute top-6 left-3 right-6 h-1.5 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}></div>
                  <div className={`absolute top-9 left-3 right-9 h-1.5 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatFormMockup;