import { motion } from "framer-motion";
import { Camera, ArrowRight, Zap } from "lucide-react";

export default function ISLRecognitionSection({ onTryClick }) {
  return (
    <section id="isl-recognition" data-testid="isl-recognition-section" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <div className="section-divider" style={{ margin: "0 0 1.5rem 0" }} />
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink mb-4">
                ISL Recognition in real-time
              </h2>
              <p className="text-ink-secondary leading-relaxed">
                Point your camera at your hands and SaathiFy recognizes Indian Sign Language gestures
                instantly — no special hardware needed. Just your webcam and your hands.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: "🤙", label: "300+ ISL Signs", desc: "Growing vocabulary library" },
                { icon: "⚡", label: "Real-time Detection", desc: "Under 100ms latency" },
                { icon: "🎯", label: "High Accuracy", desc: "ML-powered recognition" },
                { icon: "📱", label: "Browser Native", desc: "No app installation needed" },
              ].map((f) => (
                <div key={f.label} className="p-4 bg-[#FAF6F0] rounded-2xl border border-sand">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="font-semibold text-ink text-sm">{f.label}</div>
                  <div className="text-xs text-ink-muted">{f.desc}</div>
                </div>
              ))}
            </div>

            <button
              data-testid="isl-recognition-try-btn"
              onClick={onTryClick}
              className="flex items-center gap-2 px-6 py-3 bg-terracotta text-white font-semibold rounded-2xl hover:bg-terracotta-hover transition-all shadow-soft"
            >
              <Camera className="w-5 h-5" /> Try ISL Recognition <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Camera Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-[#1A1A2E] rounded-3xl overflow-hidden shadow-lift aspect-video relative">
              {/* Polished Mock AI Camera Visual */}
              <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#1E1E38] via-[#14142B] to-[#0D0D1E] flex items-center justify-center">
                {/* Grid backdrop */}
                <div className="absolute inset-0 bg-[radial-gradient(#E07A5F_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                
                {/* Stream indicator */}
                <div className="absolute top-4 left-6 flex items-center gap-2 z-10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400/90 uppercase font-semibold">LIVE FEED · 30 FPS</span>
                </div>

                {/* Hand Sign Gesture Illustration & Keypoint Overlay */}
                <div className="relative w-56 h-56 flex items-center justify-center">
                  {/* Glowing AI Bounding Box */}
                  <div className="absolute inset-2 border border-terracotta/40 rounded-2xl bg-terracotta/5 backdrop-blur-[1px] flex flex-col justify-between p-2">
                    <div className="flex justify-between text-[9px] font-mono text-terracotta/70 font-semibold uppercase">
                      <span>SIGN_DETECT: NAMASTE</span>
                      <span>94.2% CONF</span>
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-sage/70 uppercase">
                      <span>LM: 21_JOINTS</span>
                      <span>TRACKING</span>
                    </div>
                  </div>

                  {/* SVG Hand Silhouette with Joint Keypoints */}
                  <svg width="140" height="140" viewBox="0 0 100 100" className="relative z-10 drop-shadow-[0_0_12px_rgba(224,122,95,0.4)]">
                    {/* Folded Hands Silhouette */}
                    <path
                      d="M38 75 C 38 75, 34 50, 36 38 C 37 32, 42 22, 47 18 C 49 16, 51 16, 53 18 C 58 22, 63 32, 64 38 C 66 50, 62 75, 62 75 Z"
                      fill="url(#handGrad)"
                      stroke="#E07A5F"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M32 78 C 32 78, 28 55, 31 44 C 33 37, 40 28, 46 22 C 48 20, 52 20, 54 22 C 60 28, 67 37, 69 44 C 72 55, 68 78, 68 78 Z"
                      fill="none"
                      stroke="#81B29A"
                      strokeWidth="1"
                      strokeDasharray="3 2"
                      opacity="0.7"
                    />
                    {/* Landmark Skeletons */}
                    <path d="M50 82 L50 45 M50 45 L42 28 M50 45 L58 28 M50 45 L46 22 M50 45 L54 22 M50 82 L38 65 M50 82 L62 65" stroke="#81B29A" strokeWidth="1.2" strokeLinecap="round" />
                    {/* Glowing Joint Nodes */}
                    <circle cx="50" cy="82" r="3" fill="#E07A5F" />
                    <circle cx="50" cy="45" r="2.5" fill="#81B29A" />
                    <circle cx="42" cy="28" r="2" fill="#F2CC8F" />
                    <circle cx="58" cy="28" r="2" fill="#F2CC8F" />
                    <circle cx="46" cy="22" r="2" fill="#E07A5F" />
                    <circle cx="54" cy="22" r="2" fill="#E07A5F" />
                    <circle cx="38" cy="65" r="2" fill="#81B29A" />
                    <circle cx="62" cy="65" r="2" fill="#81B29A" />

                    <defs>
                      <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#D06346" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Corner brackets */}
              {[["top-4 left-4", "border-t-2 border-l-2"], ["top-4 right-4", "border-t-2 border-r-2"],
                ["bottom-4 left-4", "border-b-2 border-l-2"], ["bottom-4 right-4", "border-b-2 border-r-2"]].map(([pos, border]) => (
                <div key={pos} className={`absolute w-6 h-6 border-sage ${border} ${pos} rounded-sm`} />
              ))}

              {/* Status chip */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <span className="status-chip status-recognized flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> Recognized: "Namaste"
                </span>
              </div>

              {/* Recognized text card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-bold text-ink text-lg">Namaste</span>
                  <span className="text-xs font-semibold text-sage bg-sage-light px-2 py-0.5 rounded-full">94% confident</span>
                </div>
                <div className="flex gap-2">
                  {["Confirm", "Edit", "Try Again"].map((a) => (
                    <button key={a} className="px-3 py-1 text-xs font-medium rounded-full bg-[#FAF6F0] text-ink hover:bg-terracotta hover:text-white transition-colors">{a}</button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
