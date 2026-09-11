import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Zap, CheckCircle, Edit2, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

const MOCK_SIGNS = ["Namaste", "Thank You", "Hello", "Help", "Water", "Yes", "No", "Please", "Sorry", "Good morning"];
const SUGGESTIONS = {
  "Namaste": ["Greetings", "Hello", "Welcome"],
  "Thank You": ["Grateful", "Thanks", "Appreciate"],
  "Help": ["Assist", "Support", "Aid"],
  "Hello": ["Hi", "Hey", "Greet"],
  "Water": ["Drink", "H2O", "Thirsty"],
};

const STATUS_FLOW = ["idle", "initializing", "ready", "detecting", "recognized"];

export default function ISLCameraWorkspace({ onClose }) {
  const [status, setStatus] = useState("idle");
  const [recognized, setRecognized] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [cameraOn, setCameraOn] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const startCamera = () => {
    setCameraOn(true);
    setStatus("initializing");
    setTimeout(() => { setStatus("ready"); toast.success("Camera connected!"); }, 1500);
  };

  const startDetection = () => {
    setStatus("detecting");
    setRecognized(null);
    const sign = MOCK_SIGNS[Math.floor(Math.random() * MOCK_SIGNS.length)];
    const conf = 78 + Math.floor(Math.random() * 20);
    let c = 0;
    const interval = setInterval(() => { c += 5; setConfidence(Math.min(c, conf)); if (c >= conf) clearInterval(interval); }, 50);
    setTimeout(() => { setRecognized(sign); setStatus("recognized"); clearInterval(interval); setConfidence(conf); }, 2200);
  };

  const reset = () => { setStatus("ready"); setRecognized(null); setConfidence(0); };

  const confirm = () => { toast.success(`Confirmed: "${recognized}"`); reset(); };

  const statusConfig = {
    idle: { label: "Camera Off", cls: "status-off", dot: "bg-ink-muted" },
    initializing: { label: "Initializing…", cls: "status-processing", dot: "bg-[#A0732A] animate-pulse" },
    ready: { label: "Camera Ready", cls: "status-ready", dot: "bg-sage" },
    detecting: { label: "Detecting Sign…", cls: "status-listening", dot: "bg-sage animate-pulse" },
    recognized: { label: `Recognized!`, cls: "status-recognized", dot: "bg-terracotta" },
  };
  const sc = statusConfig[status];

  return (
    <div className="workspace-overlay" data-testid="isl-camera-workspace-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-4 sm:inset-8 bg-white rounded-3xl overflow-hidden flex flex-col shadow-lift"
      >
        {/* Header */}
        <div className="workspace-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-terracotta-light rounded-xl flex items-center justify-center text-terracotta">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-ink">ISL Camera Workspace</h2>
              <p className="text-xs text-ink-muted">Indian Sign Language Recognition</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`status-chip ${sc.cls}`}><span className={`w-2 h-2 rounded-full ${sc.dot}`} />{sc.label}</span>
            <button onClick={onClose} data-testid="isl-workspace-close" className="p-2 rounded-xl hover:bg-[#FAF6F0] text-ink-muted hover:text-ink" aria-label="Close workspace">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-6 grid lg:grid-cols-3 gap-6">
          {/* Camera view — 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-[#1A1A2E] rounded-2xl aspect-video relative overflow-hidden">
              {/* Scanning overlay */}
              {status === "detecting" && (
                <motion.div className="absolute inset-0 border-2 border-sage rounded-2xl"
                  animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }} />
              )}

              {cameraOn ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Mock hand landmark overlay */}
                  <div className="relative">
                    {status === "detecting" || status === "recognized" ? (
                      <motion.svg width="160" height="160" viewBox="0 0 160 160"
                        animate={status === "detecting" ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        <circle cx="80" cy="130" r="20" fill="rgba(129,178,154,0.3)" stroke="#81B29A" strokeWidth="2" />
                        {[60,70,80,90,100].map((x, i) => (
                          <g key={i}>
                            <line x1={x} y1="115" x2={x - 10 + i * 5} y2="60" stroke="#81B29A" strokeWidth="3" strokeLinecap="round" />
                            <circle cx={x - 10 + i * 5} cy="58" r="5" fill="rgba(129,178,154,0.8)" />
                          </g>
                        ))}
                        {status === "recognized" && (
                          <motion.circle cx="80" cy="80" r="70" fill="none" stroke="#E07A5F" strokeWidth="2"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
                          />
                        )}
                      </motion.svg>
                    ) : (
                      <div className="text-white/20 text-center">
                        <Camera className="w-16 h-16 mx-auto mb-3" />
                        <p className="text-sm">Position your hands in frame</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/30">
                  <Camera className="w-16 h-16" />
                  <p className="text-sm font-medium">Click "Start Camera" to begin</p>
                  <p className="text-xs opacity-60">We'll request camera permission securely</p>
                </div>
              )}

              {/* Corner brackets */}
              {["top-4 left-4 border-t-2 border-l-2", "top-4 right-4 border-t-2 border-r-2",
                "bottom-4 left-4 border-b-2 border-l-2", "bottom-4 right-4 border-b-2 border-r-2"].map((c) => (
                <div key={c} className={`absolute w-6 h-6 ${c} border-sage rounded-sm`} />
              ))}
            </div>

            {/* Confidence bar */}
            {confidence > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-ink-muted">
                  <span>Confidence</span><span className="font-semibold text-terracotta">{confidence}%</span>
                </div>
                <div className="h-2 bg-sand rounded-full overflow-hidden">
                  <motion.div className="h-full bg-terracotta rounded-full"
                    initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 0.3 }} />
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-3">
              {!cameraOn && (
                <button onClick={startCamera} data-testid="isl-start-camera-btn"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-terracotta text-white font-semibold rounded-2xl hover:bg-terracotta-hover transition-colors">
                  <Camera className="w-5 h-5" /> Start Camera
                </button>
              )}
              {status === "ready" && (
                <button onClick={startDetection} data-testid="isl-detect-btn"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-sage text-white font-semibold rounded-2xl hover:bg-sage-hover transition-colors">
                  <Zap className="w-5 h-5" /> Start Detection
                </button>
              )}
              {status === "detecting" && (
                <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-sage-light text-sage-hover font-semibold rounded-2xl">
                  <div className="flex gap-1">{[...Array(3)].map((_, i) => (
                    <motion.div key={i} className="w-2 h-2 bg-sage rounded-full"
                      animate={{ y: [-3, 0, -3] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} />
                  ))}</div>
                  Scanning signs…
                </div>
              )}
              {(status === "recognized") && (
                <>
                  <button onClick={reset} data-testid="isl-again-btn"
                    className="flex items-center gap-1 px-4 py-3 bg-[#FAF6F0] text-ink rounded-2xl font-medium text-sm border border-sand hover:bg-parchment">
                    <RotateCcw className="w-4 h-4" /> Again
                  </button>
                  <button onClick={() => { setRecognized(null); setStatus("ready"); setConfidence(0); }}
                    data-testid="isl-clear-btn"
                    className="flex items-center gap-1 px-4 py-3 bg-[#FAF6F0] text-ink rounded-2xl font-medium text-sm border border-sand hover:bg-parchment">
                    <Trash2 className="w-4 h-4" /> Clear
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Result panel — 1/3 */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-ink">Recognition Result</h3>

            <AnimatePresence mode="wait">
              {recognized ? (
                <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-terracotta-light rounded-2xl p-6 border border-terracotta/20">
                  <p className="text-xs font-semibold text-terracotta uppercase tracking-widest mb-2">Detected Sign</p>
                  <p className="font-heading font-bold text-3xl text-ink mb-1">{recognized}</p>
                  <p className="text-sm text-ink-muted mb-4">{confidence}% confidence</p>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={confirm} data-testid="isl-confirm-btn"
                      className="flex items-center gap-1.5 px-4 py-2 bg-terracotta text-white rounded-xl text-sm font-semibold hover:bg-terracotta-hover">
                      <CheckCircle className="w-4 h-4" /> Confirm
                    </button>
                    <button data-testid="isl-edit-btn"
                      className="flex items-center gap-1.5 px-4 py-2 bg-white text-ink rounded-xl text-sm font-medium border border-sand hover:bg-[#FAF6F0]">
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                  </div>

                  {/* Suggestions */}
                  {confidence < 90 && SUGGESTIONS[recognized] && (
                    <div className="mt-4">
                      <p className="text-xs text-ink-muted mb-2">Other possibilities:</p>
                      <div className="flex gap-2 flex-wrap">
                        {SUGGESTIONS[recognized].map((s) => (
                          <button key={s} data-testid={`isl-suggestion-${s}`}
                            className="px-3 py-1.5 bg-white rounded-full text-xs font-medium text-ink-secondary border border-sand hover:border-terracotta hover:text-terracotta">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="empty" className="bg-[#FAF6F0] rounded-2xl p-6 border border-sand text-center">
                  <Camera className="w-10 h-10 text-sand mx-auto mb-3" />
                  <p className="text-sm text-ink-muted">Recognition result will appear here</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Permission note */}
            <div className="bg-sage-light rounded-2xl p-4 border border-sage/20">
              <p className="text-xs text-sage-hover leading-relaxed">
                <strong>Camera permission:</strong> SaathiFy uses your camera only for real-time sign recognition.
                No video is stored or sent to servers.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
