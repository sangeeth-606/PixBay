import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import FullScreenModal from "./FullScreenModal";
import CustomSignInForm from "../auth/CustomSignInForm";
import PlatFormMockup from "../icons/PlatFormMockup";
import { Video as VideoIcon, Clipboard, Users } from "lucide-react";
import { motion } from "framer-motion";

interface CallToActionProps {
  darkMode: boolean;
}

const CallToAction: React.FC<CallToActionProps> = ({ darkMode }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="py-16 md:py-24 px-6 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute transform rotate-[135deg] opacity-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-[100px] w-[800px] bg-emerald-500 my-[100px] ml-[-400px]"
              style={{ transform: `translateX(${i * 200}px)` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Get Started?
        </h2>
        <p
          className={`mx-auto max-w-2xl mb-10 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Create a room or join your team in seconds. Experience the future of
          collaborative workspaces.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-8 rounded-md font-medium text-lg flex items-center transition-all transform hover:scale-105"
          >
            Sign Up Free
            <ArrowRight className="ml-2" size={18} />
          </button>
          <button
            onClick={() =>
              window.open(
                "https://sangeeth.is-a.dev/",
                "_blank",
                "noopener,noreferrer",
              )
            }
            className={`py-3 px-8 rounded-md font-medium text-lg transition-all transform hover:scale-105 cursor-pointer ${
              darkMode
                ? "bg-[#171717] hover:bg-[#2C2C2C] text-white border border-[#2C2C2C]"
                : "bg-white hover:bg-gray-100 text-[#212121] border border-gray-300"
            }`}
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Sign In Modal */}
      <FullScreenModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex w-full h-full min-h-screen max-h-screen overflow-hidden flex-col lg:flex-row font-inter">
          {/* Left: Single page style, no box */}
          <div
            className={`flex-1 lg:flex-[1.2] flex flex-col justify-center items-center bg-white border-r-0 lg:border-r border-gray-200 lg:rounded-l-2xl shadow-lg p-4 sm:p-6 lg:p-0 transition-all duration-300 overflow-y-auto`}
          >
            <div className="w-full max-w-sm mx-auto flex flex-col items-center py-8">
              <h2 className="text-xl sm:text-2xl lg:text-lg font-medium mb-2 lg:mb-1 text-gray-900 tracking-tight text-center">
                Sign in to Pixbay
              </h2>
              <p className="text-gray-400 mb-6 lg:mb-5 text-sm lg:text-xs font-normal text-center">
                Welcome back! To continue, sign in to your account
              </p>
              <CustomSignInForm hideHeading />
            </div>
          </div>
          {/* Right: Modern, feature-rich, on-brand */}
          <div className="relative flex-1 lg:flex-[0.8] flex flex-col items-center justify-start bg-gradient-to-br from-[#171717] to-[#23272f] rounded-none lg:rounded-r-2xl overflow-y-auto min-h-[300px] sm:min-h-[400px] px-4 sm:px-6 lg:px-4 py-6 sm:py-8">
            {/* Glowing emerald accent */}
            <div className="absolute -top-12 sm:-top-24 -left-12 sm:-left-24 w-48 sm:w-96 h-48 sm:h-96 bg-emerald-500/20 rounded-full blur-3xl z-0 animate-pulse" />
            <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">
              {/* Headline & tagline */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 text-center px-2">
                All-in-one Collaboration Platform
              </h2>
              <p className="text-gray-300 mb-4 sm:mb-6 text-center text-sm sm:text-base lg:text-lg max-w-md px-2">
                Create rooms, manage projects, and connect instantly.
              </p>
              {/* App Preview */}
              <motion.div
                className="w-full flex justify-center mb-4 sm:mb-6"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="scale-75 sm:scale-90 lg:scale-100">
                  <PlatFormMockup darkMode={true} />
                </div>
              </motion.div>
              {/* Feature List */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 mt-4 sm:mt-8 px-2">
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/20 flex-shrink-0">
                    <VideoIcon
                      size={16}
                      className="sm:w-5 sm:h-5 text-emerald-400"
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="text-white font-medium text-sm sm:text-base">
                      One-Click Video Meetings
                    </div>
                    <div className="text-gray-400 text-xs">
                      Join video calls instantly with a single click.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/20 flex-shrink-0">
                    <Clipboard
                      size={16}
                      className="sm:w-5 sm:h-5 text-emerald-400"
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="text-white font-medium text-sm sm:text-base">
                      Project Management
                    </div>
                    <div className="text-gray-400 text-xs">
                      Organize tasks with Kanban boards and timelines.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/20 flex-shrink-0">
                    <Users
                      size={16}
                      className="sm:w-5 sm:h-5 text-emerald-400"
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="text-white font-medium text-sm sm:text-base">
                      Team Collaboration
                    </div>
                    <div className="text-gray-400 text-xs">
                      Work together with shared workspaces.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/20 flex-shrink-0">
                    <VideoIcon
                      size={16}
                      className="sm:w-5 sm:h-5 text-emerald-400"
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="text-white font-medium text-sm sm:text-base">
                      Real-Time Communication
                    </div>
                    <div className="text-gray-400 text-xs">
                      Stay connected with instant messaging.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FullScreenModal>
    </section>
  );
};

export default CallToAction;
