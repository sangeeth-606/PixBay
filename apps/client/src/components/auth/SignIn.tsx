import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import FullScreenModal from "../common/FullScreenModal";
import CustomSignInForm from "./CustomSignInForm";
import PlatFormMockup from "../icons/PlatFormMockup";
import {
  Video as VideoIcon,
  Clipboard,
  Users,
  LogOut,
  Settings,
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";

interface SignInProps {
  darkMode?: boolean;
}

function SignIn({ darkMode = false }: SignInProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex items-center space-x-4">
      <SignedOut>
        <motion.button
          onClick={() => setModalOpen(true)}
          whileHover={{ letterSpacing: "0.05em" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`inline-flex items-center justify-center whitespace-nowrap text-sm px-3 py-1.5 rounded-md cursor-pointer ${
            darkMode
              ? "bg-transparent text-white hover:bg-[#2C2C2C]"
              : "bg-transparent text-gray-700"
          } transition-colors`}
        >
          Sign In
        </motion.button>
        <FullScreenModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <div className="flex w-full h-full min-h-screen max-h-screen overflow-hidden flex-col lg:flex-row font-inter">
            {/* Left: Single page style, no box */}
            <div
              className={`flex-1 lg:flex-[1.2] flex flex-col justify-center items-center ${darkMode ? "bg-[#1C1C1C]" : "bg-gray-100"} border-r-0 lg:border-r border-gray-200 lg:rounded-l-2xl shadow-lg p-4 sm:p-6 lg:p-0 transition-all duration-300 overflow-y-auto`}
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
                        Create or Join Rooms
                      </div>
                      <div className="text-gray-400 text-xs">
                        Start a new workspace or join with a code.
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
                        Real-Time Collaboration
                      </div>
                      <div className="text-gray-400 text-xs">
                        Work together with chat, whiteboards, and docs.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FullScreenModal>
      </SignedOut>
      <SignedIn>
        {/* Custom User Profile Popover */}
        <UserProfilePopover />
      </SignedIn>
    </div>
  );
}

function UserProfilePopover() {
  const { user } = useUser();
  const { signOut, openUserProfile: openProfileModal } = useClerk();

  if (!user) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-emerald-500/60 hover:border-emerald-500 transition-colors bg-[#171717] focus:outline-none focus:ring-2 focus:ring-emerald-500/40">
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-56 sm:w-64 p-3 sm:p-4 bg-[#171717] text-white border border-[#23272f] shadow-xl rounded-2xl"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-emerald-500/40"
          />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm sm:text-base truncate">
              {user.fullName || user.username}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {user.primaryEmailAddress?.emailAddress}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <button
            className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md hover:bg-[#23272f] transition-colors text-xs sm:text-sm"
            onClick={() => (openProfileModal ? openProfileModal() : null)}
          >
            <Settings size={14} className="sm:w-4 sm:h-4 text-emerald-400" />
            Manage account
          </button>
          <button
            className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md hover:bg-[#23272f] transition-colors text-xs sm:text-sm text-red-400"
            onClick={() => signOut()}
          >
            <LogOut size={14} className="sm:w-4 sm:h-4" />
            Sign out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default SignIn;
