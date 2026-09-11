import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Mic, MicOff, Plus, Trash2, Send, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const PRESET_SIGNS = ["Hello", "Thank you", "Please wait", "Yes", "No", "Repeat", "I need help", "One moment"];
const MIC_STATES = { off: { label: "Virtual Mic Off", cls: "status-off" }, connected: { label: "Mic Connected", cls: "status-connected" }, speaking: { label: "Speaking…", cls: "status-speaking" } };

export default function LiveCommWorkspace({ onClose }) {
  const [micState, setMicState] = useState("off");
  const [queue, setQueue] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [cameraOn, setCameraOn] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const connectMic = () => {
    setMicState("connected");
    toast.success("Virtual microphone connected");
  };

  const addToQueue = (sign) => {
    setQueue((q) => [...q, { id: Date.now(), text: sign }]);
  };

  const removeFromQueue = (id) => setQueue((q) => q.filter((m) => m.id !== id));

  const speakToMeeting = () => {
    if (queue.length === 0) { toast.error("Queue is empty — add signs first"); return; }
    const sentence = queue.map((m) => m.text).join(". ");
    setMicState("speaking");
    setTimeout(() => {
      setSentMessages((p) => [...p, { id: Date.now(), text: sentence, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      setQueue([]);
      setMicState("connected");
      toast.success("Sent to meeting!");
    }, 2000);
  };

  const mc = MIC_STATES[micState];

  return (
    <div className="workspace-overlay" data-testid="live-communication-workspace-overlay">
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
            <div className="w-9 h-9 bg-sage-light rounded-xl flex items-center justify-center text-sage">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-ink">Live Communication</h2>
              <p className="text-xs text-ink-muted">ISL to Speech Bridge</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`status-chip ${mc.cls}`}><span className="w-2 h-2 bg-current rounded-full" />{mc.label}</span>
            <button onClick={onClose} data-testid="live-workspace-close" className="p-2 rounded-xl hover:bg-[#FAF6F0] text-ink-muted hover:text-ink" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 overflow-hidden grid lg:grid-cols-2 gap-0">
          {/* Camera Left */}
          <div className="border-r border-sand flex flex-col p-6 gap-4">
            <div className="bg-[#1A1A2E] rounded-2xl aspect-video relative overflow-hidden flex-shrink-0">
              {cameraOn ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/30 text-center">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-40" />
                    <p className="text-sm opacity-60">Your camera feed</p>
                  </div>
                  {micState === "speaking" && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-terracotta/90 px-4 py-2 rounded-full">
                      <div className="flex gap-1">{[...Array(5)].map((_, i) => <div key={i} className="mic-bar" style={{ background: "white" }} />)}</div>
                      <span className="text-white text-xs font-semibold">Speaking</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/30">
                  <Users className="w-12 h-12" />
                  <button onClick={() => setCameraOn(true)} data-testid="live-start-camera-btn"
                    className="px-4 py-2 bg-sage text-white rounded-xl text-sm font-semibold hover:bg-sage-hover transition-colors">
                    Enable Camera
                  </button>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="bg-white/10 text-white text-xs px-2 py-1 rounded-full">Your View</span>
              </div>
            </div>

            {/* Virtual Mic */}
            {micState === "off" ? (
              <button onClick={connectMic} data-testid="live-connect-mic-btn"
                className="flex items-center justify-center gap-2 py-3 bg-sage text-white font-semibold rounded-2xl hover:bg-sage-hover transition-colors">
                <Mic className="w-5 h-5" /> Connect Virtual Mic
              </button>
            ) : (
              <div className={`flex items-center gap-3 p-3 rounded-2xl ${micState === "speaking" ? "bg-terracotta-light border border-terracotta/20" : "bg-sage-light border border-sage/20"}`}>
                {micState === "speaking" ? (
                  <div className="flex gap-1 items-center">{[...Array(5)].map((_, i) => <div key={i} className="mic-bar" />)}</div>
                ) : (
                  <Mic className="w-5 h-5 text-sage" />
                )}
                <span className={`text-sm font-semibold ${micState === "speaking" ? "text-terracotta" : "text-sage-hover"}`}>{mc.label}</span>
                <button onClick={() => setMicState("off")} className="ml-auto p-1 text-ink-muted hover:text-ink">
                  <MicOff className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Sent messages */}
            {sentMessages.length > 0 && (
              <div className="space-y-2 flex-1 overflow-y-auto">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest">Sent to Meeting</p>
                {sentMessages.map((m) => (
                  <div key={m.id} className="bg-[#FAF6F0] rounded-xl px-4 py-3 text-sm text-ink border border-sand">
                    <p>{m.text}</p>
                    <p className="text-xs text-ink-muted mt-1">{m.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Queue Right */}
          <div className="flex flex-col p-6 gap-4 overflow-hidden">
            <div>
              <h3 className="font-heading font-semibold text-ink mb-1">Message Queue</h3>
              <p className="text-sm text-ink-muted">Add signs to queue, then speak all at once</p>
            </div>

            {/* Queue items */}
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
              <AnimatePresence>
                {queue.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-ink-muted text-sm gap-2">
                    <ChevronRight className="w-8 h-8 text-sand" />
                    Queue is empty — add signs below
                  </div>
                ) : (
                  queue.map((item, i) => (
                    <motion.div key={item.id}
                      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                      className="flex items-center gap-3 bg-[#FAF6F0] rounded-xl px-4 py-3 border border-sand group"
                    >
                      <span className="w-6 h-6 bg-terracotta text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                      <span className="flex-1 text-sm font-medium text-ink">{item.text}</span>
                      <button onClick={() => removeFromQueue(item.id)} data-testid={`queue-remove-${i}`}
                        className="opacity-0 group-hover:opacity-100 p-1 text-ink-muted hover:text-terracotta transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Preset signs to add */}
            <div>
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">Quick Add</p>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_SIGNS.map((s) => (
                  <button key={s} onClick={() => addToQueue(s)} data-testid={`live-add-sign-${s.replace(" ", "-")}`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl text-xs font-medium text-ink border border-sand hover:border-terracotta hover:text-terracotta transition-colors">
                    <Plus className="w-3 h-3" /> {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Speak button */}
            <button
              onClick={speakToMeeting}
              disabled={queue.length === 0 || micState === "speaking" || micState === "off"}
              data-testid="live-speak-btn"
              className="flex items-center justify-center gap-2 py-4 bg-terracotta text-white font-bold rounded-2xl hover:bg-terracotta-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-lg"
            >
              {micState === "speaking" ? (
                <><div className="flex gap-1">{[...Array(5)].map((_, i) => <div key={i} className="mic-bar" style={{ height: "16px" }} />)}</div> Speaking…</>
              ) : (
                <><Send className="w-5 h-5" /> Speak to Meeting ({queue.length})</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
