import { motion } from "framer-motion";
import { Type, Mic, Hand } from "lucide-react";

const modes = [
  {
    icon: <Type className="w-7 h-7" />,
    title: "Text Communication",
    desc: "Express yourself through text with AI-powered assistance and smart suggestions.",
    color: "terracotta",
    bg: "bg-terracotta-light",
    ring: "ring-terracotta/20",
    text: "text-terracotta",
    pill: "Perfect for written expression",
  },
  {
    icon: <Mic className="w-7 h-7" />,
    title: "Voice Navigation",
    desc: "Control SaathiFy hands-free with natural voice commands. Say 'Hi Dost' to begin.",
    color: "sage",
    bg: "bg-sage-light",
    ring: "ring-sage/20",
    text: "text-sage",
    pill: "Hands-free control",
  },
  {
    icon: <Hand className="w-7 h-7" />,
    title: "ISL Sign Language",
    desc: "Communicate naturally using Indian Sign Language, recognized in real-time via your camera.",
    color: "butter",
    bg: "bg-butter-light",
    ring: "ring-butter/20",
    text: "text-[#A0732A]",
    pill: "Real-time recognition",
  },
];

export default function InteractionModes() {
  return (
    <section
      id="interaction-modes"
      data-testid="interaction-modes-section"
      className="py-24 px-4 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="section-divider" />
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink mb-4">
            Three ways to communicate
          </h2>
          <p className="text-ink-secondary max-w-xl mx-auto">
            SaathiFy adapts to how you communicate best — text, voice, or sign language.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {modes.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className={`relative bg-white rounded-2xl p-8 border border-sand shadow-card hover:shadow-lift transition-shadow duration-300 ring-2 ring-transparent hover:${m.ring} group`}
              data-testid={`interaction-card-${m.color}`}
            >
              <div className={`w-14 h-14 ${m.bg} rounded-2xl flex items-center justify-center mb-6 ${m.text} group-hover:scale-110 transition-transform duration-200`}>
                {m.icon}
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${m.bg} ${m.text} mb-3`}>
                {m.pill}
              </span>
              <h3 className="font-heading text-xl font-bold text-ink mb-3">{m.title}</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
