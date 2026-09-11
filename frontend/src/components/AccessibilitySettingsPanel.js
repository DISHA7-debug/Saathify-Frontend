import { motion } from "framer-motion";
import { Settings2, Type, Eye, Zap, Mic } from "lucide-react";

const fontSizes = ["sm", "md", "lg", "xl"];
const fontSizeLabels = { sm: "Small", md: "Default", lg: "Large", xl: "Extra Large" };

export default function AccessibilitySettingsPanel({ settings, onChange, onDrawerOpen }) {
  const update = (key, val) => onChange({ ...settings, [key]: val });

  return (
    <section id="accessibility" data-testid="accessibility-settings-section" className="py-24 px-4 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="section-divider" />
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink mb-4">Accessibility Settings</h2>
          <p className="text-ink-secondary max-w-xl mx-auto">Customize SaathiFy to work exactly the way you need it.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Font Size */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 border border-sand shadow-card"
            data-testid="a11y-font-size-card"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-terracotta-light rounded-xl flex items-center justify-center text-terracotta">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-ink text-sm">Font Size</div>
                <div className="text-xs text-ink-muted">{fontSizeLabels[settings.fontSize]}</div>
              </div>
            </div>
            <div className="flex gap-2">
              {fontSizes.map((s) => (
                <button key={s} onClick={() => update("fontSize", s)} data-testid={`font-size-${s}`}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                    settings.fontSize === s ? "bg-terracotta text-white" : "bg-[#FAF6F0] text-ink-muted hover:bg-parchment"
                  }`}>
                  {fontSizeLabels[s][0]}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Toggles */}
          {[
            { key: "dyslexicFont", label: "Dyslexia-Friendly Font", desc: "OpenDyslexic typeface", icon: <Type className="w-5 h-5" />, color: "sage" },
            { key: "highContrast", label: "High Contrast", desc: "Stronger color contrast", icon: <Eye className="w-5 h-5" />, color: "butter" },
            { key: "reduceMotion", label: "Reduce Motion", desc: "Minimize animations", icon: <Zap className="w-5 h-5" />, color: "blush" },
            { key: "voiceNav", label: "Voice Navigation", desc: "Control with voice", icon: <Mic className="w-5 h-5" />, color: "terracotta" },
          ].map((t, i) => (
            <motion.div
              key={t.key}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: (i + 1) * 0.08 }}
              className="bg-white rounded-2xl p-6 border border-sand shadow-card"
              data-testid={`a11y-${t.key}-card`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${t.color}-light rounded-xl flex items-center justify-center text-${t.color}`}>
                    {t.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-ink text-sm">{t.label}</div>
                    <div className="text-xs text-ink-muted">{t.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => update(t.key, !settings[t.key])}
                  data-testid={`a11y-toggle-${t.key}`}
                  role="switch"
                  aria-checked={settings[t.key]}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta ${
                    settings[t.key] ? "bg-terracotta" : "bg-sand"
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                    settings[t.key] ? "translate-x-6" : "translate-x-0"
                  }`} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* More settings CTA */}
        <div className="flex justify-center">
          <button
            data-testid="a11y-open-drawer-btn"
            onClick={onDrawerOpen}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-sand text-ink font-semibold rounded-2xl hover:border-terracotta hover:text-terracotta transition-all shadow-card"
          >
            <Settings2 className="w-5 h-5" /> More Accessibility Options
          </button>
        </div>
      </div>
    </section>
  );
}
