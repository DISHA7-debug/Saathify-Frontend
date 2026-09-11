import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Send, Mic, Hand, Sparkles } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QUICK_PROMPTS = [
  "How do I sign 'Hello'?",
  "What features does SaathiFy have?",
  "How does ISL recognition work?",
  "Tips for learning ISL",
];

function getSessionId() {
  let id = localStorage.getItem("dost_session");
  if (!id) { id = `dost_${Date.now()}_${Math.random().toString(36).slice(2)}`; localStorage.setItem("dost_session", id); }
  return id;
}

function DostOrb({ onClick, isOpen, reduced }) {
  return (
    <motion.button
      onClick={onClick}
      data-testid="dost-ai-orb"
      aria-label={isOpen ? "Close Dost AI" : "Open Dost AI"}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-16 h-16 rounded-full shadow-lift focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-terracotta/40"
    >
      {!reduced && !isOpen && (
        <>
          <span className="absolute inset-0 rounded-full bg-blush/50 animate-ping" style={{ animationDuration: "2.5s" }} />
          <span className="absolute inset-2 rounded-full bg-terracotta/20 animate-ping" style={{ animationDuration: "3.2s" }} />
        </>
      )}
      <motion.div
        animate={reduced || isOpen ? {} : { scale: [1, 1.07, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-terracotta to-blush flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X className="w-7 h-7 text-white" />
            </motion.div>
          ) : (
            <motion.div key="face" initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <svg width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" fill="rgba(255,255,255,0.2)" />
                <circle cx="11" cy="14" r="3" fill="white" />
                <circle cx="21" cy="14" r="3" fill="white" />
                <circle cx="12" cy="14.5" r="1.5" fill="#2B2D42" />
                <circle cx="22" cy="14.5" r="1.5" fill="#2B2D42" />
                <path d="M 11 22 Q 16 27 21 22" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}

export default function DostAI({ isOpen, onClose }) {
  const [tab, setTab] = useState("text");
  const [messages, setMessages] = useState([
    { id: "init", role: "assistant", content: "Namaste! I'm Dost, your SaathiFy companion. I can help you learn ISL, navigate features, or just chat. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const reduced = useReducedMotion();
  const sessionId = getSessionId();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || isStreaming) return;
    const userMsg = { id: Date.now(), role: "user", content: text };
    const aId = Date.now() + 1;
    const aMsg = { id: aId, role: "assistant", content: "", streaming: true };
    setMessages((p) => [...p, userMsg, aMsg]);
    setInput("");
    setIsStreaming(true);
    try {
      const res = await fetch(`${API}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: text }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop();
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "text") {
                setMessages((p) => p.map((m) => m.id === aId ? { ...m, content: m.content + data.content } : m));
              } else if (data.type === "done" || data.type === "error") {
                const content = data.type === "error" ? data.content : undefined;
                setMessages((p) => p.map((m) => m.id === aId ? { ...m, streaming: false, ...(content ? { content } : {}) } : m));
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages((p) => p.map((m) => m.id === aId ? { ...m, content: "Connection error. Please try again.", streaming: false } : m));
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div data-testid="dost-ai-floating-bot" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            data-testid="dost-chat-panel"
            className="w-[340px] sm:w-[400px] bg-white rounded-3xl shadow-lift border border-sand flex flex-col overflow-hidden"
            style={{ maxHeight: "min(560px, calc(100vh - 120px))" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-terracotta to-[#D06346] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 32 32">
                    <circle cx="11" cy="13" r="3" fill="white" /><circle cx="21" cy="13" r="3" fill="white" />
                    <circle cx="12" cy="13.5" r="1.5" fill="#E07A5F" /><circle cx="22" cy="13.5" r="1.5" fill="#E07A5F" />
                    <path d="M 11 21 Q 16 26 21 21" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="font-heading font-bold text-white text-sm">Dost AI</div>
                  <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse" /><span className="text-white/70 text-xs">Online · Gemini Flash</span></div>
                </div>
              </div>
              <button onClick={onClose} className="text-white/80 hover:text-white p-1" data-testid="dost-panel-close"><X className="w-5 h-5" /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-sand bg-[#FAF6F0]">
              {[["text", "Text", <Sparkles key="t" className="w-3.5 h-3.5" />], ["voice", "Voice", <Mic key="v" className="w-3.5 h-3.5" />], ["isl", "ISL", <Hand key="i" className="w-3.5 h-3.5" />]].map(([id, label, icon]) => (
                <button key={id} onClick={() => setTab(id)} data-testid={`dost-tab-${id}`}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors ${tab === id ? "text-terracotta border-b-2 border-terracotta bg-white" : "text-ink-muted hover:text-ink"}`}>
                  {icon}{label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {tab === "text" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ minHeight: "200px", maxHeight: "280px" }}>
                    {messages.map((m) => (
                      <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"} ${m.streaming ? "typing-cursor" : ""}`}>
                          {m.content || (m.streaming ? "Thinking…" : "")}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  {/* Quick prompts */}
                  <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
                    {QUICK_PROMPTS.map((q) => (
                      <button key={q} onClick={() => sendMessage(q)} data-testid="dost-quick-prompt"
                        className="flex-shrink-0 px-3 py-1.5 bg-parchment rounded-full text-xs text-ink-secondary hover:bg-terracotta-light hover:text-terracotta transition-colors whitespace-nowrap">
                        {q}
                      </button>
                    ))}
                  </div>
                  {/* Input */}
                  <div className="p-3 border-t border-sand flex gap-2">
                    <input value={input} onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                      placeholder="Ask Dost anything…" disabled={isStreaming}
                      data-testid="dost-chat-input"
                      className="flex-1 px-4 py-2.5 bg-[#FAF6F0] border border-sand rounded-xl text-sm outline-none focus:border-terracotta transition-colors placeholder:text-ink-muted" />
                    <button onClick={() => sendMessage(input)} disabled={!input.trim() || isStreaming}
                      data-testid="dost-send-btn"
                      className="w-10 h-10 bg-terracotta rounded-xl flex items-center justify-center text-white disabled:opacity-40 hover:bg-terracotta-hover transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              {tab === "voice" && (
                <div className="flex flex-col items-center justify-center p-8 gap-6 text-center h-48">
                  <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center"><Mic className="w-8 h-8 text-sage" /></div>
                  <div><p className="font-heading font-semibold text-ink mb-1">Voice Assistant</p><p className="text-sm text-ink-muted">Hold Space to speak. Say "Hi Dost" to activate hands-free mode.</p></div>
                  <button data-testid="dost-voice-btn" className="px-6 py-3 bg-sage text-white rounded-2xl font-semibold text-sm hover:bg-sage-hover transition-colors">
                    Hold to Speak
                  </button>
                </div>
              )}
              {tab === "isl" && (
                <div className="flex flex-col items-center justify-center p-8 gap-6 text-center h-48">
                  <div className="w-16 h-16 bg-terracotta-light rounded-full flex items-center justify-center"><Hand className="w-8 h-8 text-terracotta" /></div>
                  <div><p className="font-heading font-semibold text-ink mb-1">ISL Input Mode</p><p className="text-sm text-ink-muted">Sign to me! Open the ISL Camera to start communicating with signs.</p></div>
                  <button data-testid="dost-isl-btn" className="px-6 py-3 bg-terracotta text-white rounded-2xl font-semibold text-sm hover:bg-terracotta-hover transition-colors">
                    Open ISL Camera
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orb */}
      <DostOrb onClick={() => (isOpen ? onClose() : null) || (!isOpen ? (() => {})() : null)} isOpen={isOpen} reduced={reduced} />
    </div>
  );
}
