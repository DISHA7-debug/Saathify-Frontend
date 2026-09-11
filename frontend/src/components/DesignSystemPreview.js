import { motion } from "framer-motion";

const COLORS = [
  { name: "Terracotta", hex: "#E07A5F", label: "Primary" },
  { name: "Sage Green", hex: "#81B29A", label: "Secondary" },
  { name: "Butter Yellow", hex: "#F2CC8F", label: "Accent" },
  { name: "Blush Rose", hex: "#F4ACB7", label: "Soft Accent" },
  { name: "Cream", hex: "#FAF6F0", label: "Background" },
  { name: "Ink", hex: "#2B2D42", label: "Text Primary" },
  { name: "Sage Light", hex: "#E8F4EE", label: "Surface" },
  { name: "Sand", hex: "#E8DFD8", label: "Border" },
];

const TYPE_SCALE = [
  { label: "H1 — Display", size: "text-4xl sm:text-5xl font-bold", sample: "SaathiFy 2.0" },
  { label: "H2 — Heading", size: "text-2xl sm:text-3xl font-bold", sample: "Accessible Communication" },
  { label: "H3 — Subheading", size: "text-xl font-semibold", sample: "ISL Recognition Engine" },
  { label: "Body — Regular", size: "text-base", sample: "Technology that understands how you communicate." },
  { label: "Caption", size: "text-sm text-ink-muted", sample: "Powered by Gemini Flash · WCAG AA+" },
];

const BUTTONS = [
  { label: "Primary", cls: "bg-terracotta text-white hover:bg-terracotta-hover" },
  { label: "Secondary", cls: "bg-sage text-white hover:bg-sage-hover" },
  { label: "Outline", cls: "border-2 border-terracotta text-terracotta hover:bg-terracotta-light" },
  { label: "Ghost", cls: "text-ink hover:bg-parchment" },
];

const BADGES = [
  { label: "Camera Ready", cls: "status-ready" },
  { label: "Listening", cls: "status-listening" },
  { label: "Processing", cls: "status-processing" },
  { label: "Recognized", cls: "status-recognized" },
  { label: "Connected", cls: "status-connected" },
];

export default function DesignSystemPreview() {
  return (
    <section id="design-system" data-testid="design-system-preview" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="section-divider" />
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink mb-4">Design System</h2>
          <p className="text-ink-secondary max-w-xl mx-auto">SaathiFy's visual language — a warm, inclusive palette designed for accessibility and clarity.</p>
        </div>

        <div className="space-y-12">
          {/* Colors */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="font-heading font-semibold text-ink mb-6">Color Palette</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {COLORS.map((c) => (
                <div key={c.hex} className="space-y-2" data-testid={`ds-color-${c.name.replace(" ", "-").toLowerCase()}`}>
                  <div className="w-full aspect-square rounded-2xl border border-sand/50 shadow-card" style={{ backgroundColor: c.hex }} />
                  <div className="text-center">
                    <div className="text-xs font-semibold text-ink">{c.name}</div>
                    <div className="text-xs text-ink-muted font-mono">{c.hex}</div>
                    <div className="text-xs text-ink-muted">{c.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Typography */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h3 className="font-heading font-semibold text-ink mb-6">Typography Scale</h3>
            <div className="bg-[#FAF6F0] rounded-2xl p-8 border border-sand space-y-6">
              {TYPE_SCALE.map((t) => (
                <div key={t.label} className="flex items-baseline gap-6 pb-4 border-b border-sand/50 last:border-0 last:pb-0">
                  <span className="text-xs text-ink-muted w-36 flex-shrink-0 font-mono">{t.label}</span>
                  <span className={`font-heading ${t.size} text-ink`}>{t.sample}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <h3 className="font-heading font-semibold text-ink mb-6">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              {BUTTONS.map((b) => (
                <button key={b.label} data-testid={`ds-btn-${b.label.toLowerCase()}`}
                  className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-soft ${b.cls}`}>
                  {b.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Status Pills */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h3 className="font-heading font-semibold text-ink mb-6">Status Pills</h3>
            <div className="flex flex-wrap gap-3">
              {BADGES.map((b) => (
                <span key={b.label} data-testid={`ds-badge-${b.label}`} className={`status-chip ${b.cls}`}>
                  <span className="w-2 h-2 bg-current rounded-full opacity-70" />{b.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Focus ring demo */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}>
            <h3 className="font-heading font-semibold text-ink mb-6">Focus Accessibility</h3>
            <div className="flex gap-4 items-center flex-wrap">
              <button data-testid="ds-focus-demo"
                className="px-5 py-2.5 bg-terracotta text-white rounded-xl font-medium focus-visible:ring-4 focus-visible:ring-terracotta/40 focus-visible:ring-offset-2 focus-visible:outline-none">
                Focus me (Tab)
              </button>
              <input placeholder="Or this input…" data-testid="ds-input-demo"
                className="px-4 py-2.5 border-2 border-sand rounded-xl text-sm outline-none focus:border-terracotta transition-colors placeholder:text-ink-muted" />
              <span className="text-sm text-ink-muted">3px Terracotta focus ring · WCAG AA+</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
