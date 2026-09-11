import { motion } from "framer-motion";
import { Users, Mic, ArrowRight } from "lucide-react";

export default function LiveCommSection({ onOpenClick }) {
  return (
    <section id="live-comm" data-testid="live-comm-section" className="py-24 px-4 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl overflow-hidden shadow-card border border-sand"
          >
            {/* Header */}
            <div className="bg-[#FAF6F0] border-b border-sand p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F2CC8F]" />
                <div className="w-3 h-3 rounded-full bg-sage" />
                <div className="w-3 h-3 rounded-full bg-terracotta" />
              </div>
              <span className="text-xs font-semibold text-ink-muted">Live Communication</span>
              <span className="status-chip status-connected text-xs">Connected</span>
            </div>

            <div className="grid grid-cols-2 gap-0">
              {/* Camera view */}
              <div className="bg-gradient-to-b from-[#1A1A2E] to-[#111122] aspect-square relative overflow-hidden flex items-center justify-center">
                {/* Live stream indicator */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-medium text-white/80">LIVE</span>
                </div>

                {/* Speaker avatar / Video feed mockup graphic */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-terracotta to-sage flex items-center justify-center p-0.5 shadow-lg">
                      <div className="w-full h-full rounded-full bg-[#1F2036] flex items-center justify-center overflow-hidden">
                        <Users className="w-8 h-8 text-sage-light" />
                      </div>
                    </div>
                    {/* Audio wave pulse ring */}
                    <span className="absolute -inset-1 rounded-full border border-sage/40 animate-ping opacity-75" style={{ animationDuration: "2s" }} />
                  </div>
                  {/* Subtle Audio Spectrum Bar Graphic */}
                  <div className="flex items-center gap-1 h-3 mt-1">
                    {[40, 80, 50, 100, 60, 90, 30].map((h, i) => (
                      <span key={i} className="w-0.5 bg-sage/80 rounded-full animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>

                {/* Your Camera Label */}
                <div className="absolute bottom-2 left-2 right-2 bg-black/40 backdrop-blur-md rounded-xl p-2 border border-white/10">
                  <p className="text-white text-xs font-semibold text-center">Your Camera</p>
                </div>
              </div>

              {/* Message Queue */}
              <div className="bg-[#FAF6F0] p-4 flex flex-col gap-2">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-1">Message Queue</p>
                {["Hello", "Thank you", "Please help"].map((msg, i) => (
                  <div key={msg} className="bg-white rounded-xl px-3 py-2 text-sm text-ink border border-sand shadow-sm">
                    {msg}
                  </div>
                ))}
                <button className="mt-auto flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-xl text-sm font-semibold">
                  <Mic className="w-4 h-4" /> Speak to Meeting
                </button>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <div className="section-divider" style={{ margin: "0 0 1.5rem 0" }} />
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink mb-4">
                Live Communication Bridge
              </h2>
              <p className="text-ink-secondary leading-relaxed">
                Join any video meeting and communicate through ISL. SaathiFy translates your signs
                into speech in real-time — you stay in control of every message before it's sent.
              </p>
            </div>

            <div className="space-y-3">
              {[
                "Queue multiple signs before speaking",
                "Virtual microphone integration",
                "You control what and when to send",
                "Works with Zoom, Meet, Teams",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-sage-light flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-sage rounded-full" />
                  </div>
                  <span className="text-ink-secondary text-sm">{f}</span>
                </div>
              ))}
            </div>

            <button
              data-testid="live-comm-open-btn"
              onClick={onOpenClick}
              className="flex items-center gap-2 px-6 py-3 bg-sage text-white font-semibold rounded-2xl hover:bg-sage-hover transition-all shadow-soft"
            >
              <Users className="w-5 h-5" /> Open Communication <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
