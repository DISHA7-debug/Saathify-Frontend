import { AnimatePresence, motion } from "framer-motion";
import { X, Type, Eye, Zap, Mic, BookOpen, Keyboard } from "lucide-react";

const SHORTCUTS = [
  { key: "Space (hold)", action: "Voice navigation push-to-talk" },
  { key: "Esc", action: "Close any overlay" },
  { key: "Alt + D", action: "Toggle Dost AI panel" },
  { key: "Alt + C", action: "Open ISL Camera" },
  { key: "Alt + R", action: "Open Document Reader" },
  { key: "Alt + A", action: "Open Accessibility settings" },
];

const fontSizes = ["sm", "md", "lg", "xl"];
const fontSizeLabels = { sm: "Small (14px)", md: "Default (16px)", lg: "Large (18px)", xl: "Extra Large (20px)" };

export default function AccessibilityDrawer({ isOpen, onClose, settings, onChange }) {
  const update = (key, val) => onChange({ ...settings, [key]: val });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50" data-testid="accessibility-settings-drawer">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-lift flex flex-col"
            role="dialog" aria-label="Accessibility Settings"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-sand">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-terracotta-light rounded-xl flex items-center justify-center text-terracotta">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-ink">Accessibility</h2>
                  <p className="text-xs text-ink-muted">Personalize your experience</p>
                </div>
              </div>
              <button onClick={onClose} data-testid="a11y-drawer-close" className="p-2 rounded-xl hover:bg-[#FAF6F0] text-ink-muted hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Font Size */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Type className="w-4 h-4 text-terracotta" />
                  <h3 className="font-semibold text-ink text-sm">Font Size</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {fontSizes.map((s) => (
                    <button key={s} onClick={() => update("fontSize", s)} data-testid={`drawer-font-${s}`}
                      className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                        settings.fontSize === s ? "bg-terracotta text-white" : "bg-[#FAF6F0] text-ink hover:bg-parchment"
                      }`}>
                      {fontSizeLabels[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                <h3 className="font-semibold text-ink text-sm">Display Options</h3>
                {[
                  { key: "dyslexicFont", label: "Dyslexia-Friendly Font", desc: "Switch to OpenDyslexic typeface", icon: <Type className="w-4 h-4" /> },
                  { key: "highContrast", label: "High Contrast Mode", desc: "Increase color contrast for readability", icon: <Eye className="w-4 h-4" /> },
                  { key: "reduceMotion", label: "Reduce Motion", desc: "Minimize animations and transitions", icon: <Zap className="w-4 h-4" /> },
                  { key: "captions", label: "Show Captions", desc: "Display text for audio and video content", icon: <BookOpen className="w-4 h-4" /> },
                  { key: "voiceNav", label: "Voice Navigation", desc: "Control SaathiFy with voice commands", icon: <Mic className="w-4 h-4" /> },
                ].map((t) => (
                  <div key={t.key} className="flex items-center justify-between p-4 bg-[#FAF6F0] rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-terracotta-light rounded-lg flex items-center justify-center text-terracotta">{t.icon}</div>
                      <div>
                        <div className="font-medium text-ink text-sm">{t.label}</div>
                        <div className="text-xs text-ink-muted">{t.desc}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => update(t.key, !settings[t.key])}
                      data-testid={`drawer-toggle-${t.key}`}
                      role="switch" aria-checked={settings[t.key]}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${settings[t.key] ? "bg-terracotta" : "bg-sand"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${settings[t.key] ? "translate-x-6" : "translate-x-0"}`} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Keyboard Shortcuts */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Keyboard className="w-4 h-4 text-terracotta" />
                  <h3 className="font-semibold text-ink text-sm">Keyboard Shortcuts</h3>
                </div>
                <div className="space-y-2">
                  {SHORTCUTS.map((s) => (
                    <div key={s.key} className="flex items-center justify-between p-3 bg-[#FAF6F0] rounded-xl">
                      <span className="text-sm text-ink-secondary">{s.action}</span>
                      <kbd className="px-2 py-1 bg-white rounded-lg text-xs font-mono text-ink border border-sand shadow-sm">{s.key}</kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-sand">
              <button onClick={() => onChange({ fontSize: "md", dyslexicFont: false, highContrast: false, reduceMotion: false, captions: true, voiceNav: false })}
                data-testid="a11y-reset-btn"
                className="w-full py-3 bg-[#FAF6F0] text-ink-muted text-sm font-medium rounded-xl hover:bg-parchment transition-colors">
                Reset to defaults
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
