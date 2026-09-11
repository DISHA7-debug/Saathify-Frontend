import { Hand, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2B2D42] text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-terracotta rounded-xl flex items-center justify-center">
                <Hand className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-2xl">
                Saathi<span className="text-terracotta">Fy</span>
              </span>
            </div>
            <p className="text-white/60 leading-relaxed max-w-sm text-sm">
              Technology that understands how you communicate. Building an inclusive world
              through Indian Sign Language recognition and accessible AI.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-blush" fill="#F4ACB7" />
              <span>for the deaf community</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-white/90 text-sm uppercase tracking-widest">Features</h4>
            {["ISL Camera Recognition", "Live Communication", "Document Reader", "Dost AI Assistant", "ISL Avatar"].map((f) => (
              <p key={f} className="text-white/50 text-sm hover:text-white/80 cursor-pointer transition-colors">{f}</p>
            ))}
          </div>

          {/* Accessibility */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-white/90 text-sm uppercase tracking-widest">Accessibility</h4>
            {["WCAG AA+ Compliant", "Screen Reader Ready", "Keyboard Navigation", "Voice Control", "Braille Support"].map((f) => (
              <p key={f} className="text-white/50 text-sm hover:text-white/80 cursor-pointer transition-colors">{f}</p>
            ))}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">© 2025 SaathiFy. Built for inclusion.</p>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
            <span className="w-2 h-2 bg-sage rounded-full animate-pulse" />
            <span className="text-white/60 text-xs">WCAG AA+ Accessibility Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
