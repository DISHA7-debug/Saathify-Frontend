import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hand, Settings, Menu, X, MessageCircle, Mic } from "lucide-react";

export default function Navbar({ onA11yOpen, onDostOpen, onISLClick, onLiveClick, onDocClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Features", href: "#interaction-modes" },
    { label: "ISL Camera", href: "#isl-recognition", action: null },
    { label: "Live Comm", href: "#live-comm", action: null },
    { label: "Learn", href: "#learning" },
    { label: "Avatar", href: "#isl-avatar" },
  ];

  return (
    <nav
      data-testid="sticky-navbar"
      className="sticky top-0 z-40 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-sand"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group" data-testid="navbar-logo">
          <div className="w-8 h-8 bg-terracotta rounded-xl flex items-center justify-center shadow-soft">
            <Hand className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-bold text-xl text-ink">
            Saathi<span className="text-terracotta">Fy</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-ink-secondary hover:text-terracotta transition-colors duration-200"
              data-testid={`nav-link-${l.label.toLowerCase().replace(" ", "-")}`}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onA11yOpen}
            data-testid="navbar-a11y-btn"
            aria-label="Accessibility Settings"
            className="p-2 rounded-xl hover:bg-parchment text-ink-muted hover:text-terracotta transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={onDostOpen}
            data-testid="navbar-dost-btn"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-xl text-sm font-semibold hover:bg-terracotta-hover transition-colors shadow-soft"
          >
            <MessageCircle className="w-4 h-4" />
            Try Dost AI
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-parchment text-ink-secondary"
            aria-label="Toggle menu"
            data-testid="navbar-menu-btn"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-sand bg-[#FAF6F0]/95 overflow-hidden"
            data-testid="navbar-mobile-menu"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-ink-secondary hover:text-terracotta py-2 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <button
                onClick={() => { onDostOpen(); setMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-xl text-sm font-semibold mt-2"
              >
                <MessageCircle className="w-4 h-4" />
                Try Dost AI
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
