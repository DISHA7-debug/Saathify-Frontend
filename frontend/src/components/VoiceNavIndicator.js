import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

export default function VoiceNavIndicator({ state, command, onToggle }) {
  return (
    <div className="fixed top-20 right-4 z-50" data-testid="voice-navigation-indicator">
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={state === "off" ? "Enable voice navigation" : "Disable voice navigation"}
        className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-soft border transition-all duration-300 text-sm font-semibold ${
          state === "off"
            ? "bg-white border-sand text-ink-muted"
            : state === "listening"
            ? "bg-sage-light border-sage text-sage-hover"
            : "bg-terracotta-light border-terracotta text-terracotta"
        }`}
      >
        {state === "listening" ? (
          <div className="flex items-center gap-1">
            <div className="mic-bar" />
            <div className="mic-bar" />
            <div className="mic-bar" />
            <div className="mic-bar" />
            <div className="mic-bar" />
          </div>
        ) : (
          <Mic className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">
          {state === "off" ? "Voice Nav" : state === "listening" ? "Listening…" : `"${command}"`}
        </span>
        {state !== "off" && (
          <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
