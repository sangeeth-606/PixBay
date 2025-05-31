import { Video as VideoIcon, Users, Clipboard } from "lucide-react"; // Adjust import path if needed

interface PlatFormMockupProps {
  darkMode?: boolean;
}

const PlatFormMockup = ({ darkMode = false }: PlatFormMockupProps) => {
  return (
    <div className="w-full max-w-3xl p-4">
      <div
        className={`w-full mb-4 flex items-center justify-between ${
          darkMode ? "bg-[#1C1C1C]" : "bg-gray-100"
        } p-3 rounded-lg`}
      >
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#ef4444] mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-[#f59e0b] mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
        </div>
        <div
          className={`px-4 py-1 rounded-md text-xs ${
            darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"
          }`}
        >
          pixbay.workspace/room/XYZ-123
        </div>
        <div className="flex items-center space-x-3">
          <VideoIcon size={16} className="text-emerald-500" />
          <Users
            size={16}
            className={darkMode ? "text-gray-400" : "text-gray-600"}
          />
          <Clipboard size={16} className="text-emerald-500" />
        </div>
      </div>

      <div className="flex w-full h-48 gap-4">
        {/* Sidebar */}
        <div
          className={`w-1/4 rounded-lg ${
            darkMode ? "bg-[#1C1C1C]" : "bg-gray-100"
          } p-3`}
        >
          <div className="w-full h-6 mb-3 rounded-md bg-emerald-500 bg-opacity-20"></div>
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className={`w-full h-4 mb-2 rounded-md ${
                darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>

        {/* Main content */}
        <div
          className={`flex-1 rounded-lg ${
            darkMode ? "bg-[#1C1C1C]" : "bg-gray-100"
          } p-3`}
        >
          <div className="flex justify-between mb-3">
            <div
              className={`w-1/3 h-6 rounded-md ${
                darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"
              }`}
            ></div>
            <div className="w-24 h-6 rounded-md bg-emerald-500 bg-opacity-30"></div>
          </div>

          {/* Kanban-like board */}
          <div className="flex gap-2 h-32">
            {[1, 2, 3].map((col) => (
              <div
                key={col}
                className={`flex-1 rounded-md p-2 ${
                  darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"
                }`}
              >
                <div
                  className={`w-full h-4 mb-2 rounded-sm ${
                    darkMode ? "bg-[#333]" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`w-full h-16 rounded-sm bg-emerald-500 bg-opacity-30`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatFormMockup;
