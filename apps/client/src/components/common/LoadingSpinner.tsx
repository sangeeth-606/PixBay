import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({
  size = 20,
  className = "",
}: LoadingSpinnerProps) => {
  return (
    <motion.div
      className={`flex items-center justify-center py-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Loader2 className="animate-spin text-emerald-500" size={size} />
    </motion.div>
  );
};

export default LoadingSpinner;
