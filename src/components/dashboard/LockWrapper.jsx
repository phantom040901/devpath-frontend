// src/components/dashboard/LockWrapper.jsx
import { motion } from "framer-motion";
import { Lock } from "lucide-react"; // using lucide-react icons

export default function LockWrapper({ isLocked, hint = "Complete Assessment to Unlock", onUnlockClick, children }) {
  return (
    <div className="relative">
      {/* Blurred content */}
      <div className={isLocked ? "pointer-events-none blur-[2px] opacity-60" : ""}>
        {children}
      </div>

      {/* Overlay */}
      {isLocked && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm"
        >
          <Lock className="w-8 h-8 text-primary-500 mb-3" />
          <p className="text-primary-100 mb-4">{hint}</p>
          <button
            onClick={onUnlockClick}
            className="rounded-full bg-primary-500 px-6 py-3 font-semibold text-primary-1300 shadow-[0_0_25px_rgba(0,255,200,0.12)] hover:shadow-[0_0_40px_rgba(0,255,200,0.2)] transition-all"
          >
            Take Assessment
          </button>
        </motion.div>
      )}
    </div>
  );
}
