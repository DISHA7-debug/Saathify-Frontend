import { motion, useReducedMotion } from "framer-motion";
import { Camera, MessageCircle, ArrowRight } from "lucide-react";

const chips = [
  { label: "Text Mode", color: "bg-terracotta-light text-terracotta" },
  { label: "Voice Mode", color: "bg-sage-light text-sage-hover" },
  { label: "ISL Signs", color: "bg-butter-light text-[#A0732A]" },
  { label: "Braille", color: "bg-blush-light text-[#B05595]" },
];

function DostSVG({ reduced }) {
  return (
    <motion.div
      animate={reduced ? {} : { scale: [1, 1.07, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      {/* Pulse rings */}
      {!reduced && (
        <>
          <div className="absolute inset-0 rounded-full bg-blush/30 animate-ping" style={{ animationDuration: "2.5s" }} />
          <div className="absolute inset-2 rounded-full bg-terracotta/20 animate-ping" style={{ animationDuration: "3s", animationDelay: "0.5s" }} />
        </>
      )}
      <svg width="160" height="160" viewBox="0 0 160 160" className="relative z-10" aria-label="Dost AI companion character">
        {/* Outer glow */}
        <circle cx="80" cy="80" r="72" fill="rgba(244,172,183,0.15)" />
        {/* Body */}
        <circle cx="80" cy="80" r="62" fill="#F4ACB7" />
        <circle cx="80" cy="80" r="56" fill="#E07A5F" />
        {/* Face area */}
        <ellipse cx="80" cy="88" rx="34" ry="28" fill="#F4EAE1" />
        {/* Eyes */}
        <circle cx="67" cy="76" r="7" fill="white" />
        <circle cx="93" cy="76" r="7" fill="white" />
        <circle cx="69" cy="77" r="4" fill="#2B2D42" />
        <circle cx="95" cy="77" r="4" fill="#2B2D42" />
        {/* Eye shine */}
        <circle cx="70" cy="75" r="1.5" fill="white" />
        <circle cx="96" cy="75" r="1.5" fill="white" />
        {/* Smile */}
        <path d="M 65 96 Q 80 108 95 96" stroke="#E07A5F" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Ears */}
        <circle cx="20" cy="80" r="12" fill="#E07A5F" />
        <circle cx="140" cy="80" r="12" fill="#E07A5F" />
        <circle cx="20" cy="80" r="7" fill="#F4ACB7" />
        <circle cx="140" cy="80" r="7" fill="#F4ACB7" />
      </svg>
    </motion.div>
  );
}

export default function Hero({ onISLClick, onDostClick, onLiveClick }) {
  const reduced = useReducedMotion();

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="hero-gradient min-h-[90vh] flex items-center py-20 px-4"
    >
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta-light rounded-full text-sm font-semibold text-terracotta">
            <span className="w-2 h-2 bg-terracotta rounded-full animate-pulse" />
            Inclusive by design
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-tight">
            Technology that{" "}
            <span className="gradient-text">understands</span> how you communicate
          </h1>

          <p className="text-lg text-ink-secondary leading-relaxed max-w-lg">
            SaathiFy bridges the communication gap for the deaf and hard-of-hearing community
            through Indian Sign Language recognition, real-time translation, and accessible learning tools.
          </p>

          {/* Chips */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {chips.map((c, i) => (
              <motion.span
                key={c.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`status-chip ${c.color}`}
              >
                {c.label}
              </motion.span>
            ))}
          </motion.div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <button
              data-testid="hero-cta-dost"
              onClick={onDostClick}
              className="flex items-center gap-2 px-6 py-3 bg-terracotta text-white font-semibold rounded-2xl hover:bg-terracotta-hover transition-all duration-200 shadow-soft hover:shadow-lift"
            >
              <MessageCircle className="w-5 h-5" />
              Try Dost AI
            </button>
            <button
              data-testid="hero-cta-isl"
              onClick={onISLClick}
              className="flex items-center gap-2 px-6 py-3 bg-white text-ink font-semibold rounded-2xl hover:bg-parchment border border-sand transition-all duration-200 shadow-card"
            >
              <Camera className="w-5 h-5 text-terracotta" />
              Start ISL Camera
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-ink-muted">No sign-up required · Works in your browser</p>
        </motion.div>

        {/* Right: Dost character */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col items-center justify-center gap-8"
        >
          <div className="relative">
            <DostSVG reduced={reduced} />
            {/* Floating label */}
            <motion.div
              animate={reduced ? {} : { y: [-4, 4, -4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white border border-sand rounded-2xl px-4 py-2 shadow-card text-sm font-semibold text-ink whitespace-nowrap"
            >
              Hi! I'm Dost, your AI companion
            </motion.div>
          </div>

          {/* Feature pills floating */}
          <div className="flex gap-3 mt-8 flex-wrap justify-center">
            <button
              onClick={onISLClick}
              data-testid="hero-pill-isl"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-sand rounded-full text-sm font-medium text-ink-secondary hover:border-terracotta hover:text-terracotta transition-colors shadow-card"
            >
              <Camera className="w-4 h-4" /> ISL Recognition
            </button>
            <button
              onClick={onLiveClick}
              data-testid="hero-pill-live"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-sand rounded-full text-sm font-medium text-ink-secondary hover:border-sage hover:text-sage transition-colors shadow-card"
            >
              <span className="w-2 h-2 bg-sage rounded-full" /> Live Communication
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
