import { useState, useRef, useEffect } from "react";
import { Mic, Video, MicOff, VideoOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "left";
}

const Tooltip = ({ content, children, side = "top" }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  if (!content) {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 rounded-md bg-[#1F1F1F] px-2 py-1 text-xs text-white shadow-lg border border-[#2C2C2C] ${
            side === "top"
              ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
              : "right-full mr-2 top-1/2 -translate-y-1/2"
          }`}
        >
          {content}
          <div
            className={`absolute ${
              side === "top"
                ? "top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1F1F1F]"
                : "left-full top-1/2 -translate-y-1/2 border-b-4 border-l-4 border-t-4 border-b-transparent border-l-[#1F1F1F] border-t-transparent"
            }`}
          />
        </div>
      )}
    </div>
  );
};

interface JoinCallButtonProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "none";
  roomCode: string;
  userId: string;
  darkMode: boolean;
}

export function JoinCallButton({
  position = "bottom-right",
  roomCode,
  userId,
  darkMode,
}: JoinCallButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Manage hover state
  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  // Handle join call button click
  const handleJoinCall = () => {
    navigate("/Call", {
      state: { roomCode, userId, isMuted, isVideoOff, darkMode },
    });
  };

  // Close the expanded menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Define position styles based on the position prop
  const getPositionClasses = () => {
    switch (position) {
      case "bottom-right":
        return "fixed bottom-4 right-4";
      case "bottom-left":
        return "fixed bottom-4 left-4";
      case "top-right":
        return "fixed top-4 right-4";
      case "top-left":
        return "fixed top-4 left-4";
      case "none":
        return ""; // No fixed positioning
      default:
        return "fixed bottom-4 right-4";
    }
  };

  return (
    <div
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`z-50 flex flex-col items-center ${position !== "none" ? getPositionClasses() : ""}`}
    >
      {isExpanded && (
        <div className="flex justify-between w-[140px] rounded-lg bg-[#171717] p-2 shadow-lg border border-[#2C2C2C] mb-[-1px]">
          <Tooltip content={isMuted ? "Unmute" : "Mute"} side="top">
            <button
              aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
              className={`flex h-9 w-9 items-center justify-center rounded-md border border-[#2C2C2C] ${
                isMuted
                  ? "bg-red-500/20 text-red-500"
                  : "bg-[#1F1F1F] text-gray-300"
              }`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
          </Tooltip>

          <Tooltip
            content={isVideoOff ? "Turn Video On" : "Turn Video Off"}
            side="top"
          >
            <button
              aria-label={isVideoOff ? "Turn video on" : "Turn video off"}
              className={`flex h-9 w-9 items-center justify-center rounded-md border border-[#2C2C2C] ${
                isVideoOff
                  ? "bg-red-500/20 text-red-500"
                  : "bg-[#1F1F1F] text-gray-300"
              }`}
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? (
                <VideoOff className="h-4 w-4" />
              ) : (
                <Video className="h-4 w-4" />
              )}
            </button>
          </Tooltip>
        </div>
      )}

      <button
        ref={buttonRef}
        aria-label="Join video call"
        className="w-[140px] h-[50px] flex items-center justify-center rounded-md bg-emerald-600 px-5 py-3.5 text-sm font-medium text-white 
        shadow-lg shadow-emerald-600/20 static"
        onClick={handleJoinCall}
        onMouseEnter={(e) => {
          e.currentTarget.classList.remove("bg-emerald-600");
          e.currentTarget.classList.add("bg-emerald-500");
        }}
        onMouseLeave={(e) => {
          e.currentTarget.classList.remove("bg-emerald-500");
          e.currentTarget.classList.add("bg-emerald-600");
        }}
      >
        <Video className="mr-2 h-5 w-5" />
        <span className="font-semibold">Join Call</span>
      </button>
    </div>
  );
}
