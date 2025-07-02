import { Video, Users, Clipboard, Bell } from "lucide-react";
import { useState, useEffect } from "react";

interface PlatFormMockupProps {
  darkMode?: boolean;
}

const PlatFormMockup = ({ darkMode = false }: PlatFormMockupProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Cursor animation path with smoother timing
  useEffect(() => {
    const cursorPath = [
      // Start at traffic lights
      { x: 50, y: 50, element: "traffic-lights", delay: 2000 },
      // Move to URL bar
      { x: 300, y: 50, element: "url-bar", delay: 2500 },
      // Move to video icon
      { x: 550, y: 50, element: "video-icon", delay: 3000 },
      // Move to users icon
      { x: 580, y: 50, element: "users-icon", delay: 3500 },
      // Move to sidebar header
      { x: 80, y: 120, element: "sidebar-header", delay: 4000 },
      // Move through sidebar items
      { x: 80, y: 150, element: "sidebar-item-1", delay: 4500 },
      { x: 80, y: 170, element: "sidebar-item-2", delay: 5000 },
      { x: 80, y: 190, element: "sidebar-item-3", delay: 5500 },
      // Move to main content header
      { x: 350, y: 120, element: "main-header", delay: 6000 },
      // Move to action button
      { x: 500, y: 120, element: "action-button", delay: 6500 },
      // Move through kanban columns
      { x: 250, y: 200, element: "kanban-col-0", delay: 7000 },
      { x: 350, y: 200, element: "kanban-col-1", delay: 7500 },
      { x: 450, y: 200, element: "kanban-col-2", delay: 8000 },
      // Move to a kanban card
      { x: 250, y: 230, element: "kanban-card-0", delay: 8500 },
      // Reset with longer pause
      { x: 0, y: 0, element: null, delay: 10000 },
    ];

    let currentStep = 0;
    let animationTimeout: NodeJS.Timeout;

    const animateCursor = () => {
      if (currentStep >= cursorPath.length) {
        currentStep = 0;
      }

      const step = cursorPath[currentStep];

      setCursorPosition({ x: step.x, y: step.y });
      setHoveredElement(step.element);

      animationTimeout = setTimeout(() => {
        currentStep++;
        animateCursor();
      }, step.delay);
    };

    // Start animation after component loads with longer initial delay
    const startDelay = setTimeout(animateCursor, 3000);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(animationTimeout);
    };
  }, []);

  const isHovered = (elementId: string) => hoveredElement === elementId;

  return (
    <div className="w-full max-w-3xl p-4 relative">
      {/* Animated Cursor */}
      <div
        className="absolute pointer-events-none z-50 transition-all duration-[2000ms] ease-in-out"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          opacity: cursorPosition.x === 0 && cursorPosition.y === 0 ? 0 : 1,
        }}
      >
        <div className="relative">
          {/* Professional Mouse Pointer */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="drop-shadow-xl"
          >
            <path
              d="M5 3L19 12L12 13L8 19L5 3Z"
              fill="white"
              stroke="#1f2937"
              strokeWidth="1.5"
            />
            <path
              d="M5 3L19 12L12 13L8 19L5 3Z"
              fill="url(#cursorGradient)"
              fillOpacity="0.8"
            />
            <defs>
              <linearGradient
                id="cursorGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="50%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>
          </svg>
          {/* Enhanced cursor glow effect */}
          <div className="absolute -inset-3 bg-emerald-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -inset-2 bg-emerald-300 rounded-full opacity-30 animate-ping"></div>
        </div>
      </div>

      {/* Browser Header */}
      <div
        className={`w-full mb-4 flex items-center justify-between ${
          darkMode
            ? "bg-[#1C1C1C] border border-[#2C2C2C]"
            : "bg-gray-100 border border-gray-200"
        } p-3 rounded-lg transition-all duration-500 ${
          isLoaded ? "opacity-100" : "opacity-80"
        } ${isHovered("browser-header") ? "shadow-lg" : ""}`}
      >
        {/* Traffic Lights */}
        <div
          className={`flex items-center space-x-2 transition-all duration-300 ${
            isHovered("traffic-lights") ? "scale-110" : "scale-100"
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-sm cursor-pointer transition-all duration-300 ${
              isHovered("traffic-lights") ? "shadow-red-300 scale-125" : ""
            }`}
          ></div>
          <div
            className={`w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-sm cursor-pointer transition-all duration-300 ${
              isHovered("traffic-lights") ? "shadow-yellow-300 scale-125" : ""
            }`}
          ></div>
          <div
            className={`w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm cursor-pointer transition-all duration-300 ${
              isHovered("traffic-lights") ? "shadow-emerald-300 scale-125" : ""
            }`}
          ></div>
        </div>

        {/* URL Bar */}
        <div
          className={`flex-1 mx-6 px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 ${
            darkMode
              ? "bg-[#0f0f0f] text-gray-300 border border-gray-700"
              : "bg-white text-gray-600 border border-gray-300"
          } ${isHovered("url-bar") ? "border-emerald-400 shadow-lg bg-emerald-50" : ""}`}
        >
          <span className="text-emerald-500">🔒</span>
          <span className="ml-1">pixbay.space/workspace/xyz-1234</span>
          {isHovered("url-bar") && (
            <span className="ml-2 text-emerald-500 animate-pulse">|</span>
          )}
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-4">
          <div
            className={`relative transition-all duration-300 ${
              isHovered("video-icon") ? "scale-125" : "scale-100"
            }`}
          >
            <Video
              size={18}
              className={`text-emerald-500 cursor-pointer transition-all duration-300 ${
                isHovered("video-icon")
                  ? "text-emerald-300 drop-shadow-lg"
                  : "hover:text-emerald-400"
              }`}
            />
            <div
              className={`absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full transition-all duration-300 ${
                isHovered("video-icon")
                  ? "animate-bounce scale-150"
                  : "animate-pulse"
              }`}
            ></div>
          </div>
          <div
            className={`relative transition-all duration-300 ${
              isHovered("users-icon") ? "scale-125" : "scale-100"
            }`}
          >
            <Users
              size={18}
              className={`cursor-pointer transition-all duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              } ${isHovered("users-icon") ? "text-emerald-400 drop-shadow-lg" : "hover:text-gray-300"}`}
            />
            <div
              className={`absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full transition-all duration-300 ${
                isHovered("users-icon") ? "animate-bounce scale-150" : ""
              }`}
            ></div>
          </div>
          <Bell
            size={18}
            className={`cursor-pointer transition-all duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } ${isHovered("bell-icon") ? "text-emerald-400 scale-125 drop-shadow-lg" : "hover:text-gray-300"}`}
          />
          <Clipboard
            size={18}
            className={`text-emerald-500 cursor-pointer transition-all duration-300 ${
              isHovered("clipboard-icon")
                ? "text-emerald-300 scale-125 drop-shadow-lg"
                : "hover:text-emerald-400"
            }`}
          />
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex w-full h-48 gap-4 transition-all duration-500 ${
          isLoaded ? "opacity-100" : "opacity-80"
        }`}
      >
        {/* Sidebar */}
        <div
          className={`w-1/4 rounded-lg p-2 transition-all duration-300 ${
            darkMode ? "bg-[#1C1C1C]" : "bg-gray-100"
          } ${isHovered("sidebar") ? "shadow-lg bg-opacity-80" : ""}`}
        >
          {/* Sidebar Header */}
          <div
            className={`w-full h-6 mb-2 rounded-md bg-emerald-500 bg-opacity-20 transition-all duration-300 ${
              isHovered("sidebar-header")
                ? "bg-opacity-40 shadow-md scale-105"
                : ""
            }`}
          ></div>

          {/* Sidebar Items */}
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className={`w-full h-4 mb-1.5 rounded-md transition-all duration-500 ${
                darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"
              } ${isHovered(`sidebar-item-${item}`) ? "bg-emerald-200 shadow-lg scale-105 translate-x-3" : ""}`}
            >
              {/* Add subtle content indicators */}
              <div
                className={`h-full w-2 rounded-l-md transition-all duration-300 ${
                  isHovered(`sidebar-item-${item}`)
                    ? "bg-emerald-400"
                    : "bg-transparent"
                }`}
              ></div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 rounded-lg p-2 transition-all duration-300 ${
            darkMode ? "bg-[#1C1C1C]" : "bg-gray-100"
          } ${isHovered("main-content") ? "shadow-lg" : ""}`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <div
              className={`w-1/3 h-6 rounded-md transition-all duration-300 ${
                darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"
              } ${isHovered("main-header") ? "bg-emerald-200 shadow-md scale-105" : ""}`}
            ></div>
            <div
              className={`w-24 h-6 rounded-md bg-emerald-500 bg-opacity-30 transition-all duration-300 ${
                isHovered("action-button")
                  ? "bg-opacity-60 shadow-lg scale-110 shadow-emerald-200"
                  : ""
              }`}
            ></div>
          </div>

          {/* Kanban Board */}
          <div className="flex gap-2 h-36">
            {[0, 1, 2].map((col) => (
              <div
                key={col}
                className={`flex-1 rounded-md p-1.5 transition-all duration-300 ${
                  darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"
                } ${isHovered(`kanban-col-${col}`) ? "bg-emerald-100 shadow-lg scale-105 -translate-y-1" : ""}`}
              >
                {/* Column Header */}
                <div
                  className={`w-full h-4 mb-1.5 rounded-sm transition-all duration-300 ${
                    darkMode ? "bg-[#333]" : "bg-gray-300"
                  } ${isHovered(`kanban-col-${col}`) ? "bg-emerald-300 shadow-sm" : ""}`}
                ></div>

                {/* Kanban Cards */}
                <div
                  className={`w-full h-20 rounded-sm bg-emerald-500 bg-opacity-30 transition-all duration-500 relative overflow-hidden ${
                    isHovered(`kanban-col-${col}`)
                      ? "bg-opacity-50 shadow-lg scale-105"
                      : ""
                  } ${isHovered(`kanban-card-${col}`) ? "bg-opacity-70 shadow-xl scale-110" : ""}`}
                >
                  {/* Add subtle task lines */}
                  <div
                    className={`absolute top-2 left-2 right-2 h-1 rounded-full transition-all duration-300 ${
                      darkMode ? "bg-gray-600" : "bg-gray-400"
                    } ${isHovered(`kanban-col-${col}`) || isHovered(`kanban-card-${col}`) ? "bg-emerald-600" : ""}`}
                  ></div>
                  <div
                    className={`absolute top-4 left-2 right-4 h-1 rounded-full transition-all duration-300 ${
                      darkMode ? "bg-gray-700" : "bg-gray-300"
                    } ${isHovered(`kanban-col-${col}`) || isHovered(`kanban-card-${col}`) ? "bg-emerald-500" : ""}`}
                  ></div>
                  <div
                    className={`absolute top-6 left-2 right-6 h-1 rounded-full transition-all duration-300 ${
                      darkMode ? "bg-gray-700" : "bg-gray-300"
                    } ${isHovered(`kanban-col-${col}`) || isHovered(`kanban-card-${col}`) ? "bg-emerald-400" : ""}`}
                  ></div>
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
