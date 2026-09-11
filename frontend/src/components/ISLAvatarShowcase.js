import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Gauge } from "lucide-react";

const STATES = [
  { id: "idle", label: "Idle", color: "text-ink-muted bg-[#F4EAE1]", ringClass: "avatar-ring-idle", description: "Resting, ready to communicate" },
  { id: "listening", label: "Listening", color: "text-sage-hover bg-sage-light", ringClass: "avatar-ring-listening", description: "Paying attention to your signs" },
  { id: "processing", label: "Processing", color: "text-[#A0732A] bg-butter-light", ringClass: "avatar-ring-processing", description: "Translating your sign language" },
  { id: "namaste", label: "Signing: Namaste", color: "text-terracotta bg-terracotta-light", ringClass: "avatar-ring-signing", description: "Greeting with hands pressed together" },
  { id: "thanks", label: "Signing: Thank You", color: "text-terracotta bg-terracotta-light", ringClass: "avatar-ring-signing", description: "Hand moves forward from chin" },
];

function AvatarSVG({ state }) {
  const isListening = state === "listening";
  const isProcessing = state === "processing";
  const isNamaste = state === "namaste";
  const isThanks = state === "thanks";

  return (
    <svg viewBox="0 0 200 260" width="200" height="260" aria-label={`ISL Avatar in ${state} state`}>
      {/* Body */}
      <ellipse cx="100" cy="220" rx="48" ry="28" fill="#F4EAE1" />
      <rect x="62" y="160" width="76" height="72" rx="14" fill="#F4ACB7" />
      {/* Neck */}
      <rect x="88" y="148" width="24" height="22" rx="8" fill="#F4EAE1" />
      {/* Head */}
      <ellipse cx="100" cy="120" rx="52" ry="56" fill="#F4EAE1" />
      <ellipse cx="100" cy="125" rx="40" ry="44" fill="#FDEAE4" />
      {/* Eyes */}
      <circle cx="84" cy="110" r="7" fill="white" />
      <circle cx="116" cy="110" r="7" fill="white" />
      <motion.circle
        cx="85" cy="111" r="4"
        fill="#2B2D42"
        animate={isListening ? { cx: [85, 87, 85] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.circle
        cx="117" cy="111" r="4"
        fill="#2B2D42"
        animate={isListening ? { cx: [117, 119, 117] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <circle cx="86" cy="109" r="1.5" fill="white" />
      <circle cx="118" cy="109" r="1.5" fill="white" />
      {/* Smile/Mouth */}
      {isProcessing ? (
        <motion.circle cx="100" cy="132" r="3" fill="#E07A5F"
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
      ) : (
        <path d={isNamaste || isThanks ? "M 86 134 Q 100 144 114 134" : "M 88 133 Q 100 141 112 133"}
          stroke="#E07A5F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}

      {/* Left arm */}
      <motion.g
        animate={
          isNamaste ? { rotate: -15, x: 8, y: -10 } :
          isThanks ? { rotate: 20, x: 6, y: -15 } :
          isListening ? { rotate: 10 } : { rotate: 0, x: 0, y: 0 }
        }
        style={{ transformOrigin: "62px 165px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <path d="M 62 165 Q 30 175 24 200" stroke="#F4ACB7" strokeWidth="18" fill="none" strokeLinecap="round" />
        <circle cx="22" cy="205" r="10" fill="#FDEAE4" />
      </motion.g>

      {/* Right arm */}
      <motion.g
        animate={
          isNamaste ? { rotate: 15, x: -8, y: -10 } :
          isThanks ? { rotate: -30, x: -8, y: -20 } :
          isListening ? { rotate: -10 } : { rotate: 0, x: 0, y: 0 }
        }
        style={{ transformOrigin: "138px 165px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <path d="M 138 165 Q 170 175 176 200" stroke="#F4ACB7" strokeWidth="18" fill="none" strokeLinecap="round" />
        <circle cx="178" cy="205" r="10" fill="#FDEAE4" />
      </motion.g>

      {/* Namaste hands */}
      {isNamaste && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <rect x="88" y="60" width="24" height="32" rx="8" fill="#F4ACB7" opacity="0.9" />
          <rect x="92" y="55" width="16" height="20" rx="6" fill="#FDEAE4" />
        </motion.g>
      )}

      {/* Processing dots */}
      {isProcessing && (
        <motion.g>
          {[0, 1, 2].map((i) => (
            <motion.circle key={i} cx={88 + i * 12} cy="75" r="4" fill="#F2CC8F"
              animate={{ y: [-4, 0, -4] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.g>
      )}

      {/* Listening ear wave */}
      {isListening && (
        <motion.g>
          {[1, 2, 3].map((i) => (
            <motion.arc key={i} />
          ))}
          <motion.path d={`M 155 108 Q ${160 + 5} 120 155 132`}
            stroke="#81B29A" strokeWidth="2" fill="none" strokeLinecap="round"
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.path d={`M 160 102 Q ${168 + 5} 120 160 138`}
            stroke="#81B29A" strokeWidth="1.5" fill="none" strokeLinecap="round"
            animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
        </motion.g>
      )}
    </svg>
  );
}

export default function ISLAvatarShowcase() {
  const [state, setState] = useState("idle");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const current = STATES.find((s) => s.id === state);

  return (
    <section id="isl-avatar" data-testid="isl-avatar-showcase" className="py-24 px-4 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="section-divider" />
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink mb-4">ISL Avatar</h2>
          <p className="text-ink-secondary max-w-xl mx-auto">
            An AI-powered avatar that signs ISL responses back to you. Placeholder for full 3D signing model.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Avatar display */}
          <div className="flex flex-col items-center gap-6">
            <div className={`avatar-ring ${current.ringClass} p-4 bg-white rounded-3xl shadow-card border border-sand`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={state}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <AvatarSVG state={state} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Status */}
            <div className={`status-chip ${current.color} text-sm`}>{current.label}</div>
            <p className="text-sm text-ink-muted text-center">{current.description}</p>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button onClick={() => setPlaying(!playing)} data-testid="avatar-play-btn"
                className="flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-xl text-sm font-semibold hover:bg-terracotta-hover">
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {playing ? "Pause" : "Play"}
              </button>
              <button onClick={() => setState("idle")} data-testid="avatar-reset-btn"
                className="p-2 rounded-xl bg-[#FAF6F0] text-ink-muted hover:text-ink border border-sand">
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-ink-muted" />
                <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                  data-testid="avatar-speed-select"
                  className="text-sm border border-sand rounded-lg px-2 py-1 bg-white text-ink">
                  <option value={0.5}>0.5×</option>
                  <option value={1}>1×</option>
                  <option value={1.5}>1.5×</option>
                  <option value={2}>2×</option>
                </select>
              </div>
            </div>
          </div>

          {/* State selector */}
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-ink mb-4">Select Avatar State</h3>
            {STATES.map((s) => (
              <button
                key={s.id}
                onClick={() => setState(s.id)}
                data-testid={`avatar-state-${s.id}`}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  state === s.id
                    ? "border-terracotta bg-terracotta-light"
                    : "border-sand bg-white hover:border-sand hover:bg-[#FAF6F0]"
                }`}
              >
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${s.color}`}>{s.label}</span>
                <span className="text-sm text-ink-secondary flex-1">{s.description}</span>
                {state === s.id && <div className="w-2 h-2 bg-terracotta rounded-full flex-shrink-0" />}
              </button>
            ))}

            <div className="p-4 bg-white rounded-2xl border border-sand mt-4">
              <p className="text-xs text-ink-muted">
                This is a placeholder avatar ready for integration with a full ISL 3D signing model.
                The real model will render accurate ISL handshapes and movements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
