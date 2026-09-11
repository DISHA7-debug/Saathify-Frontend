import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function MeetDost({ onDostOpen }) {
  return (
    <section id="meet-dost" data-testid="meet-dost-section" className="py-24 px-4 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl p-8 shadow-card border border-sand relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blush/20 rounded-full -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-sage-light rounded-full translate-y-6 -translate-x-6" />

              {/* Mock chat */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-terracotta to-blush flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 32 32">
                      <circle cx="11" cy="13" r="3" fill="white" /><circle cx="21" cy="13" r="3" fill="white" />
                      <path d="M 11 21 Q 16 26 21 21" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-ink text-sm">Dost AI</div>
                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse" /><span className="text-xs text-ink-muted">Powered by Gemini Flash</span></div>
                  </div>
                </div>

                {[
                  { role: "user", text: "How do I sign 'Thank you' in ISL?" },
                  { role: "assistant", text: "To sign 'Thank you' in ISL, bring your dominant hand to your chin with fingers together, then move it forward and slightly downward — like a gentle forward bow. Try it with our ISL Camera to practice!" },
                  { role: "user", text: "Open the document reader for me" },
                  { role: "assistant", text: "Opening the Document Reader now! You can switch between Read, Listen, and Braille modes once it's open." },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <div className="section-divider" style={{ margin: "0 0 1.5rem 0" }} />
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink mb-4">Meet Dost AI</h2>
              <p className="text-ink-secondary leading-relaxed">
                Dost is your always-on AI companion — warm, knowledgeable about ISL, and ready to
                help you navigate SaathiFy. Ask questions, learn new signs, or let Dost guide you
                through features with natural conversation.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { label: "ISL Tutor", desc: "Learn signs with step-by-step guidance and practice tips" },
                { label: "Feature Guide", desc: "Ask Dost to open any SaathiFy feature by name" },
                { label: "Real Conversations", desc: "Powered by Gemini Flash for natural, helpful responses" },
              ].map((f) => (
                <div key={f.label} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-sand">
                  <div className="w-8 h-8 bg-terracotta-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-terracotta" />
                  </div>
                  <div>
                    <div className="font-semibold text-ink text-sm">{f.label}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              data-testid="meet-dost-open-btn"
              onClick={onDostOpen}
              className="flex items-center gap-2 px-6 py-3 bg-terracotta text-white font-semibold rounded-2xl hover:bg-terracotta-hover transition-all shadow-soft"
            >
              <Sparkles className="w-5 h-5" /> Start chatting with Dost <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
