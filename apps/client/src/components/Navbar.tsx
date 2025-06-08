import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import SignIn from "./SignIn";

interface NavbarProps {
  workspaceCode?: string;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

function Navbar({ workspaceCode, darkMode, toggleDarkMode }: NavbarProps) {
  return (
    <motion.header
      className={`${darkMode ? "bg-[#171717] text-white" : "bg-white text-gray-800"} border-b ${darkMode ? "border-[#2C2C2C]" : "border-gray-200"} h-16 flex items-center justify-between px-6`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {workspaceCode && (
        <motion.span
          className="px-3 py-1 bg-[#00875A] text-white rounded-md font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {workspaceCode}
        </motion.span>
      )}

      <div className="flex items-center space-x-4">
        <motion.button
          onClick={toggleDarkMode}
          className={`p-2 rounded-md ${darkMode ? "hover:bg-[#2C2C2C]" : "hover:bg-gray-100"}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>

        <SignIn darkMode={darkMode} />
      </div>
    </motion.header>
  );
}

export default Navbar;
