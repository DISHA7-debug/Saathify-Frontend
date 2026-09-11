import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Monitor, Layers, Radio, Check, X } from "lucide-react";

const FEATURES = [
  { icon: <Layers className="w-5 h-5" />, title: "Overlay on any window", desc: "Avatar floats on top of any application — video calls, browsers, documents." },
  { icon: <Radio className="w-5 h-5" />, title: "Always-on ISL recognition", desc: "Continuous sign detection runs in the background as you work." },
  { icon: <Monitor className="w-5 h-5" />, title: "Desktop-native performance", desc: "Direct access to system camera for ultra-low latency recognition." },
  { icon: <Check className="w-5 h-5" />, title: "One-click webpage attach", desc: "Click any webpage or app window to attach Avatar — it follows you everywhere." },
];

export default function DesktopAvatar() {
  const [showDownload, setShowDownload] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => { setDownloading(false); setShowDownload(false); }, 2500);
  };

  return (
    <section id="desktop" data-testid="desktop-avatar-concept" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Laptop Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            {/* Laptop body */}
            <div className="w-full max-w-sm">
              {/* Screen */}
              <div className="bg-[#1A1A2E] rounded-t-2xl pt-3 px-3 pb-1 shadow-lift">
                <div className="bg-[#1E1F36] rounded-xl overflow-hidden aspect-[4/3] relative">
                  {/* Browser chrome */}
                  <div className="bg-[#3D405B] px-3 py-2 flex items-center gap-2">
                    {["#F2CC8F","#81B29A","#E07A5F"].map((c) => (
                      <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                    ))}
                    <div className="flex-1 bg-[#2B2D42] rounded-md px-3 py-0.5 text-xs text-white/40 ml-2">saathify.app/workspace</div>
                  </div>

                  {/* Polished Active App Screen Visual */}
                  <div className="p-3 space-y-2.5 bg-gradient-to-b from-[#252744] to-[#1E1F36] h-full">
                    {/* Header bar graphic */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-terracotta/80 flex items-center justify-center text-[8px] text-white font-bold">S</div>
                        <span className="text-[10px] font-semibold text-white/80">Accessible Workspace</span>
                      </div>
                      <span className="text-[9px] bg-sage/20 text-sage px-1.5 py-0.5 rounded">Active Sync</span>
                    </div>

                    {/* Content cards graphic */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-[9px] text-white/90 font-medium">ISL Sign Stream</div>
                        <div className="text-[8px] text-sage mt-1">● Translating Live</div>
                      </div>
                      <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-[9px] text-white/90 font-medium">Captions Log</div>
                        <div className="text-[8px] text-white/50 mt-1">3 messages queued</div>
                      </div>
                    </div>

                    {/* Paragraph lines graphic */}
                    <div className="space-y-1.5 pt-1">
                      <div className="h-1.5 bg-white/20 rounded w-5/6" />
                      <div className="h-1.5 bg-white/10 rounded w-full" />
                      <div className="h-1.5 bg-white/15 rounded w-4/6" />
                    </div>
                  </div>

                  {/* Floating Avatar orb overlay */}
                  <div className="absolute bottom-3 right-3">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-terracotta/30 animate-ping" />
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center relative z-10 shadow-lg border border-white/80 overflow-hidden">
                        <img src="/assets/dost-mascot.png" alt="Avatar Mascot" className="w-full h-full object-contain p-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Attached label */}
                  <div className="absolute top-10 right-3">
                    <span className="bg-terracotta text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-md">Avatar attached</span>
                  </div>
                </div>
              </div>
              {/* Laptop base */}
              <div className="bg-[#3D405B] rounded-b-xl h-4 mx-2" />
              <div className="bg-[#2B2D42] h-2 rounded-b-2xl mx-0" />
            </div>

            <div className="absolute -top-3 -right-3 bg-terracotta-light text-terracotta text-xs font-bold px-3 py-1 rounded-full border border-terracotta/20">
              Coming Soon
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
              <span className="inline-block px-3 py-1 bg-butter-light text-[#A0732A] text-xs font-semibold rounded-full mb-3">
                Desktop Companion
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink mb-4">
                The Avatar on your desktop
              </h2>
              <p className="text-ink-secondary leading-relaxed">
                The SaathiFy Desktop Companion brings ISL recognition to every app you use.
                Start it once — Avatar attaches to any window or webpage, giving you a communication bridge everywhere.
              </p>
            </div>

            <div className="space-y-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-4 p-4 bg-[#FAF6F0] rounded-2xl border border-sand">
                  <div className="w-10 h-10 bg-terracotta-light rounded-xl flex items-center justify-center text-terracotta flex-shrink-0">{f.icon}</div>
                  <div>
                    <div className="font-semibold text-ink text-sm">{f.title}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              data-testid="desktop-download-btn"
              onClick={() => setShowDownload(true)}
              className="flex items-center gap-2 px-6 py-3 bg-ink text-white font-semibold rounded-2xl hover:bg-ink-secondary transition-all shadow-soft"
            >
              <Download className="w-5 h-5" /> Download Beta for Windows
            </button>
          </motion.div>
        </div>
      </div>

      {/* Download Modal */}
      <AnimatePresence>
        {showDownload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setShowDownload(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-lift z-10"
              data-testid="desktop-download-modal"
            >
              <button onClick={() => setShowDownload(false)} className="absolute top-4 right-4 p-1 text-ink-muted hover:text-ink"><X className="w-5 h-5" /></button>
              <div className="w-14 h-14 bg-terracotta-light rounded-2xl flex items-center justify-center text-terracotta mb-6">
                <Monitor className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-xl text-ink mb-2">SaathiFy Desktop Beta</h3>
              <p className="text-ink-secondary text-sm mb-6">Windows 10/11 · 64-bit · 45 MB</p>

              {downloading ? (
                <div className="space-y-3">
                  <div className="h-2 bg-sand rounded-full overflow-hidden">
                    <motion.div className="h-full bg-terracotta rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.2 }} />
                  </div>
                  <p className="text-sm text-ink-muted text-center">Starting download…</p>
                </div>
              ) : (
                <button onClick={handleDownload} data-testid="desktop-download-confirm-btn"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-terracotta text-white font-semibold rounded-2xl hover:bg-terracotta-hover transition-all">
                  <Download className="w-5 h-5" /> Download Now
                </button>
              )}
              <p className="text-xs text-ink-muted text-center mt-4">Beta release · Requires camera permission</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
