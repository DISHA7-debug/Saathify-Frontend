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
              {/* Mock camera frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/20 text-center">
                  <Camera className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-sm opacity-40">Camera preview</p>
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
