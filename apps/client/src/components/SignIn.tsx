import { SignedIn, SignedOut, useClerk, UserButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";

interface SignInProps {
  darkMode?: boolean;
}

function SignIn({ darkMode = false }: SignInProps) {
  const { openSignIn } = useClerk();

  return (
    <div className="flex items-center space-x-4">
      <SignedOut>
        <motion.button
          onClick={() => openSignIn()}
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
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

export default SignIn;
