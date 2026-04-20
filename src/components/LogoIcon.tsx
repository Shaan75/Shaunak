import { motion } from "motion/react";

export const LogoIcon = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer rotating ring */}
        <motion.circle 
          cx="50" 
          cy="50" 
          r="48" 
          stroke="currentColor" 
          strokeWidth="0.5" 
          strokeDasharray="4 6"
          className="text-white/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* The "S" Path */}
        <motion.path
          d="M35 35C35 28 42 22 50 22C58 22 65 28 65 35C65 42 58 48 50 50C42 52 35 58 35 65C35 72 42 78 50 78C58 78 65 72 65 65"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Accent dots */}
        <motion.circle 
          cx="50" 
          cy="50" 
          r="3" 
          fill="currentColor" 
          className="text-white/40"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2 }}
        />
      </svg>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-white/10 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};
