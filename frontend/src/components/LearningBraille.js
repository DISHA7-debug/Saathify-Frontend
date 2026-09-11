import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Headphones, Braces } from "lucide-react";

export default function LearningBraille({ onOpenClick }) {
  return (
    <section id="learning" data-testid="learning-braille-section" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="section-divider" />
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink mb-4">
            Accessible Learning & Document Reader
          </h2>
          <p className="text-ink-secondary max-w-xl mx-auto">
            Read any document in the way that works best for you — plain text, text-to-speech audio, or Braille output.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <BookOpen className="w-7 h-7" />, mode: "Read Mode", color: "terracotta",
              bg: "bg-terracotta-light", text: "text-terracotta",
              desc: "Clean, distraction-free reading with adjustable font size and dyslexia-friendly fonts.",
              preview: <div className="space-y-2"><div className="h-2 bg-sand rounded-full w-full" /><div className="h-2 bg-sand rounded-full w-4/5" /><div className="h-2 bg-sand rounded-full w-full" /><div className="h-2 bg-sand rounded-full w-3/4" /></div>
            },
            {
              icon: <Headphones className="w-7 h-7" />, mode: "Listen Mode", color: "sage",
              bg: "bg-sage-light", text: "text-sage-hover",
              desc: "High-quality text-to-speech with speed and pitch controls for comfortable listening.",
              preview: <div className="flex items-center gap-3"><div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center"><span className="text-white text-xs">▶</span></div><div className="flex-1 h-2 bg-sand rounded-full"><div className="h-2 bg-sage rounded-full w-1/3" /></div><span className="text-xs text-ink-muted">1.0×</span></div>
            },
            {
              icon: <Braces className="w-7 h-7" />, mode: "Braille Mode", color: "butter",
              bg: "bg-butter-light", text: "text-[#A0732A]",
              desc: "Unicode Braille rendering with line-by-line highlighting, optimized for refreshable Braille displays.",
              preview: <div className="braille-text text-lg leading-loose text-ink-secondary">⠓⠑⠇⠇⠕ ⠺⠕⠗⠇⠙</div>
            },
          ].map((m, i) => (
            <motion.div
              key={m.mode}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-[#FAF6F0] rounded-2xl p-6 border border-sand space-y-4"
              data-testid={`learning-mode-${m.color}`}
            >
              <div className={`w-14 h-14 ${m.bg} rounded-2xl flex items-center justify-center ${m.text}`}>{m.icon}</div>
              <h3 className="font-heading font-bold text-ink text-lg">{m.mode}</h3>
              <p className="text-sm text-ink-secondary">{m.desc}</p>
              <div className="p-4 bg-white rounded-xl border border-sand">{m.preview}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            data-testid="learning-open-reader-btn"
            onClick={onOpenClick}
            className="flex items-center gap-2 px-8 py-4 bg-terracotta text-white font-semibold rounded-2xl hover:bg-terracotta-hover transition-all shadow-soft text-lg"
          >
            <BookOpen className="w-5 h-5" /> Open Document Reader <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
