import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import SignIn from "./SignIn";

interface NavbarProps {
  workspaceCode?: string;
}

function Navbar({ workspaceCode }: NavbarProps) {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real implementation, you would apply dark mode changes to the app
  };

  return (
    <motion.header 
      className="bg-[#171717] text-white border-b border-[#2C2C2C] h-16 flex items-center justify-between px-6 "
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
          className="p-2 rounded-md hover:bg-[#2C2C2C]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
        
        <SignIn />
      </div>
    </motion.header>
  );
}

export default Navbar;
