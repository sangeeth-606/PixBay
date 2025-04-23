import { useState, useRef, useEffect } from "react";
import { Mic, Video, UserPlus, MicOff, VideoOff } from "lucide-react";
import { motion } from "framer-motion";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "left";
}

const Tooltip = ({ content, children, side = "top" }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Don't render tooltip if content is empty
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
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`absolute z-50 rounded-md bg-[#1F1F1F] px-2 py-1 text-xs text-white shadow-lg border border-[#2C2C2C] ${
            side === "top" ? "bottom-full mb-2 left-1/2 -translate-x-1/2" : "right-full mr-2 top-1/2 -translate-y-1/2"
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
        </motion.div>
      )}
    </div>
  );
};

interface JoinCallButtonProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "none";
}

export function JoinCallButton({ position = "bottom-right" }: JoinCallButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Close the expanded menu when clicking outside
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

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
      className={`z-50 flex flex-col items-end space-y-2 ${position !== "none" ? getPositionClasses() : ""}`}
    >
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex space-x-2 rounded-lg bg-[#171717] p-2 shadow-lg border border-[#2C2C2C]"
        >
          <Tooltip content={isMuted ? "Unmute" : "Mute"} side="top">
            <motion.button
              aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className={`flex h-9 w-9 items-center justify-center rounded-md border border-[#2C2C2C] ${
                isMuted ? "bg-red-500/20 text-red-500" : "bg-[#1F1F1F] text-gray-300"
              }`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </motion.button>
          </Tooltip>

          <Tooltip content={isVideoOff ? "Turn Video On" : "Turn Video Off"} side="top">
            <motion.button
              aria-label={isVideoOff ? "Turn video on" : "Turn video off"}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className={`flex h-9 w-9 items-center justify-center rounded-md border border-[#2C2C2C] ${
                isVideoOff ? "bg-red-500/20 text-red-500" : "bg-[#1F1F1F] text-gray-300"
              }`}
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
            </motion.button>
          </Tooltip>

          <Tooltip content="Invite Others" side="top">
            <motion.button
              aria-label="Invite others to call"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-[#2C2C2C] bg-[#1F1F1F] text-gray-300"
            >
              <UserPlus className="h-4 w-4" />
            </motion.button>
          </Tooltip>
        </motion.div>
      )}

      <motion.button
        aria-label="Join video call"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white 
        hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20 
        ring-2 ring-emerald-600/50 ring-offset-2 ring-offset-[#171717]"
        onClick={() => setIsExpanded(!isExpanded)}
        animate={{
          boxShadow: [
            "0 10px 15px -3px rgba(16,185,129,0.2)",
            "0 15px 20px -3px rgba(16,185,129,0.3)",
            "0 10px 15px -3px rgba(16,185,129,0.2)",
          ],
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
      >
        <Video className="mr-2 h-5 w-5" />
        <span className="font-semibold">Join Call</span>
      </motion.button>
    </div>
  );
}