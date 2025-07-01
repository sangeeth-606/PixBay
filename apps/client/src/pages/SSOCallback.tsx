import { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [darkMode] = useState(true); // You can connect this to your global theme state

  useEffect(() => {
    const handleAuth = async () => {
      try {
        await handleRedirectCallback({
          afterSignInUrl: "/",
          afterSignUpUrl: "/",
        });
        setStatus("success");
        // Add a brief delay to show success state before navigating
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error) {
        console.error("Error handling redirect callback:", error);
        setStatus("error");
        // On error, still navigate away after showing error briefly
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    };

    handleAuth();
  }, [handleRedirectCallback, navigate]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const iconVariants = {
    loading: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
    success: {
      scale: [0, 1.2, 1],
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    error: {
      scale: [0, 1.1, 1],
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const getStatusConfig = () => {
    switch (status) {
      case "loading":
        return {
          icon: <Loader2 className="w-8 h-8" />,
          title: "Signing you in...",
          description: "Please wait while we complete your authentication",
          color: "text-emerald-500",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="w-8 h-8" />,
          title: "Welcome back!",
          description:
            "Successfully signed in. Redirecting to your workspace...",
          color: "text-emerald-500",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-8 h-8" />,
          title: "Something went wrong",
          description:
            "We encountered an issue. Don't worry, we'll redirect you shortly.",
          color: "text-red-500",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center ${
        darkMode ? "bg-[#1C1C1C] text-white" : "bg-[#F5F5F5] text-[#212121]"
      }`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute transform rotate-45 opacity-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="h-[100px] w-[800px] bg-emerald-500 my-[100px] ml-[-400px]"
              style={{ transform: `translateX(${i * 200}px)` }}
              variants={pulseVariants}
              animate="animate"
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          className="relative z-10 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center space-x-2 mb-8"
            variants={itemVariants}
          >
            <img
              src="/favicon_io/favicon-32x32.png"
              alt="Pixbay Logo"
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold">Pixbay</span>
          </motion.div>

          {/* Main card */}
          <motion.div
            className={`
              relative overflow-hidden rounded-2xl backdrop-blur-sm
              ${
                darkMode
                  ? "bg-[#171717]/80 border border-[#2C2C2C]/50"
                  : "bg-white/80 border border-gray-200/50"
              }
              shadow-2xl p-8 w-96 mx-auto
            `}
            variants={itemVariants}
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-2xl" />

            <div className="relative z-10">
              {/* Status icon */}
              <motion.div
                className={`flex items-center justify-center mb-6 ${config.color}`}
                variants={iconVariants}
                animate={status}
              >
                {config.icon}
              </motion.div>

              {/* Title */}
              <motion.h1
                className={`text-2xl font-bold mb-3 ${
                  darkMode ? "text-white" : "text-[#212121]"
                }`}
                variants={itemVariants}
              >
                {config.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                className={`text-base ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } mb-6`}
                variants={itemVariants}
              >
                {config.description}
              </motion.p>

              {/* Progress indicator */}
              <motion.div
                className="flex justify-center space-x-2"
                variants={itemVariants}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      status === "loading"
                        ? "bg-emerald-500"
                        : status === "success"
                          ? "bg-emerald-500"
                          : "bg-red-500"
                    }`}
                    animate={{
                      scale: status === "loading" ? [1, 1.5, 1] : 1,
                      opacity: status === "loading" ? [0.5, 1, 0.5] : 1,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: status === "loading" ? Infinity : 0,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Footer text */}
          <motion.p
            className={`mt-6 text-sm ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
            variants={itemVariants}
          >
            Powered by Pixbay
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
