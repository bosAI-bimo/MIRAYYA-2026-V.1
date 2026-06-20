import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Memuat data..." }: LoadingScreenProps) {
  return (
    <div className="flex flex-col h-[60vh] items-center justify-center space-y-6">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <motion.div
          className="absolute w-20 h-20 rounded-full border-4 border-pink-200/50"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Inner spinning gradient ring */}
        <motion.div
          className="absolute w-16 h-16 rounded-full border-4 border-transparent border-t-pink-600 border-r-pink-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Center dot/icon */}
        <motion.div
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-rose-400 shadow-lg shadow-pink-500/40 text-white"
          animate={{ scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Loader2 className="w-5 h-5 animate-spin" />
        </motion.div>
      </div>
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
          {message}
        </h3>
        <p className="text-sm text-slate-400 mt-1">Harap tunggu sebentar...</p>
      </motion.div>
    </div>
  );
}

export default LoadingScreen;
