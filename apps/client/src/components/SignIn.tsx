import {
  SignedIn,
  SignedOut,
  useClerk,
  useUser,
} from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import FullScreenModal from "./FullScreenModal";
import CustomSignInForm from "./CustomSignInForm";
import PlatFormMockup from "../icons/PlatFormMockup";
import {
  Video as VideoIcon,
  Clipboard,
  Users,
  LogOut,
  Settings,
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";

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
          <div className="flex w-full h-full min-h-screen flex-col md:flex-row font-inter">
            {/* Left: Single page style, no box */}
            <div
              className={`flex-[1.2] flex flex-col justify-center items-center ${darkMode ? "bg-[#1C1C1C]" : "bg-gray-100"} border-r border-gray-200 md:rounded-l-2xl shadow-lg p-0 transition-all duration-300`}
            >
              <div className="w-full max-w-sm mx-auto flex flex-col items-center">
                <h2 className="text-lg font-medium mb-1 text-gray-900 tracking-tight">
                  Sign in to Pixbay
                </h2>
                <p className="text-gray-400 mb-5 text-xs font-normal">
                  Welcome back! To continue, sign in to your account
                </p>
                <CustomSignInForm hideHeading />
              </div>
            </div>
            {/* Right: Modern, feature-rich, on-brand */}
            <div className="relative flex-[0.8] flex flex-col items-center justify-center bg-gradient-to-br from-[#171717] to-[#23272f] rounded-none md:rounded-r-2xl overflow-hidden min-h-[400px] px-4 py-8">
              {/* Glowing emerald accent */}
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl z-0 animate-pulse" />
              <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">
                {/* Headline & tagline */}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                  All-in-one Collaboration Platform
                </h2>
                <p className="text-gray-300 mb-6 text-center text-base md:text-lg max-w-md">
                  Create rooms, manage projects, and connect instantly.
                </p>
                {/* App Preview */}
                <motion.div
                  className="w-full flex justify-center mb-6"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <PlatFormMockup darkMode={true} />
                </motion.div>
                {/* Feature List */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 mt-8">
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-lg bg-emerald-500/20">
                      <VideoIcon size={20} className="text-emerald-400" />
                    </span>
                    <div>
                      <div className="text-white font-medium">
                        One-Click Video Meetings
                      </div>
                      <div className="text-gray-400 text-xs">
                        Join video calls instantly with a single click.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-lg bg-emerald-500/20">
                      <Clipboard size={20} className="text-emerald-400" />
                    </span>
                    <div>
                      <div className="text-white font-medium">
                        Project Management
                      </div>
                      <div className="text-gray-400 text-xs">
                        Organize tasks with Kanban boards and timelines.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-lg bg-emerald-500/20">
                      <Users size={20} className="text-emerald-400" />
                    </span>
                    <div>
                      <div className="text-white font-medium">
                        Create or Join Rooms
                      </div>
                      <div className="text-gray-400 text-xs">
                        Start a new workspace or join with a code.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-lg bg-emerald-500/20">
                      <Users size={20} className="text-emerald-400" />
                    </span>
                    <div>
                      <div className="text-white font-medium">
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
        className="w-64 p-4 bg-[#171717] text-white border border-[#23272f] shadow-xl rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-3">
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
          />
          <div>
            <div className="font-semibold text-base truncate">
              {user.fullName || user.username}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {user.primaryEmailAddress?.emailAddress}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#23272f] transition-colors text-sm"
            onClick={() => (openProfileModal ? openProfileModal() : null)}
          >
            <Settings size={16} className="text-emerald-400" />
            Manage account
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#23272f] transition-colors text-sm text-red-400"
            onClick={() => signOut()}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default SignIn;
