import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Headphones, Type, Play, Pause, SkipBack, SkipForward, ChevronRight, Upload } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

const BRAILLE_MAP = {
  a:'⠁',b:'⠃',c:'⠉',d:'⠙',e:'⠑',f:'⠋',g:'⠛',h:'⠓',i:'⠊',j:'⠚',
  k:'⠅',l:'⠇',m:'⠍',n:'⠝',o:'⠕',p:'⠏',q:'⠟',r:'⠗',s:'⠎',t:'⠞',
  u:'⠥',v:'⠧',w:'⠺',x:'⠭',y:'⠽',z:'⠵',' ':'⠀',',':'⠂','.':'⠲','!':'⠖','?':'⠦'
};

function toBraille(text) {
  return text.toLowerCase().split('').map(c => BRAILLE_MAP[c] || c).join('');
}

const MOCK_DOC = {
  title: "Understanding Indian Sign Language",
  paragraphs: [
    "Indian Sign Language (ISL) is the primary sign language used by the deaf community in India, with an estimated 5 million users across the country.",
    "ISL has its own grammar, syntax, and vocabulary that differs significantly from spoken Indian languages. It is a rich, expressive language with its own cultural identity.",
    "Learning ISL opens doors to meaningful communication and deeper connections with the deaf and hard-of-hearing community. SaathiFy is here to make that journey accessible to everyone.",
    "The ISL Recognition feature in SaathiFy uses machine learning to identify over 300 signs in real-time, making communication faster and more natural than ever before.",
  ]
};

export default function DocumentReaderWorkspace({ onClose }) {
  const [activeTab, setActiveTab] = useState("read");
  const [fontSize, setFontSize] = useState("md");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [activePara, setActivePara] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          const next = p + (speed * 0.5);
          if (next >= 100) { setPlaying(false); setActivePara(0); return 100; }
          setActivePara(Math.floor((next / 100) * MOCK_DOC.paragraphs.length));
          return next;
        });
      }, 200);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, speed]);

  const fontSizeClass = { sm: "text-sm", md: "text-base", lg: "text-lg", xl: "text-xl" }[fontSize];

  return (
    <div className="workspace-overlay" data-testid="document-reader-workspace-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-4 sm:inset-8 bg-white rounded-3xl overflow-hidden flex flex-col shadow-lift"
      >
        {/* Header */}
        <div className="workspace-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-butter-light rounded-xl flex items-center justify-center text-[#A0732A]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-ink">Document Reader</h2>
              <p className="text-xs text-ink-muted">{MOCK_DOC.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button data-testid="doc-upload-btn"
              className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF6F0] text-ink-secondary text-sm font-medium rounded-xl border border-sand hover:bg-parchment">
              <Upload className="w-4 h-4" /> Open Document
            </button>
            <button onClick={onClose} data-testid="doc-workspace-close" className="p-2 rounded-xl hover:bg-[#FAF6F0] text-ink-muted hover:text-ink" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 pt-4 border-b border-sand">
              <TabsList className="bg-[#FAF6F0] p-1 rounded-xl">
                <TabsTrigger value="read" data-testid="doc-tab-read"
                  className="flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:text-terracotta rounded-lg">
                  <BookOpen className="w-4 h-4" /> Read
                </TabsTrigger>
                <TabsTrigger value="listen" data-testid="doc-tab-listen"
                  className="flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:text-sage-hover rounded-lg">
                  <Headphones className="w-4 h-4" /> Listen
                </TabsTrigger>
                <TabsTrigger value="braille" data-testid="doc-tab-braille"
                  className="flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:text-[#A0732A] rounded-lg">
                  <Type className="w-4 h-4" /> Braille
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Read Tab */}
            <TabsContent value="read" className="flex-1 overflow-y-auto p-6 focus:outline-none">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs text-ink-muted">Font size:</span>
                  {["sm","md","lg","xl"].map((s) => (
                    <button key={s} onClick={() => setFontSize(s)} data-testid={`read-font-${s}`}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${fontSize === s ? "bg-terracotta text-white" : "bg-[#FAF6F0] text-ink-muted hover:bg-parchment"}`}>
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
                <h1 className={`font-heading font-bold text-ink mb-6 ${fontSize === "xl" ? "text-2xl" : fontSize === "lg" ? "text-xl" : "text-lg"}`}>
                  {MOCK_DOC.title}
                </h1>
                {MOCK_DOC.paragraphs.map((p, i) => (
                  <p key={i} className={`${fontSizeClass} text-ink-secondary leading-relaxed mb-5`}>{p}</p>
                ))}
              </div>
            </TabsContent>

            {/* Listen Tab */}
            <TabsContent value="listen" className="flex-1 overflow-y-auto p-6 focus:outline-none">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Player */}
                <div className="bg-[#FAF6F0] rounded-2xl p-6 border border-sand">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-ink text-sm">{MOCK_DOC.title}</p>
                      <p className="text-xs text-ink-muted">4 paragraphs · ~2 min</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-muted">Speed:</span>
                      {[0.5, 1, 1.5, 2].map((s) => (
                        <button key={s} onClick={() => setSpeed(s)} data-testid={`listen-speed-${s}`}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold ${speed === s ? "bg-sage text-white" : "bg-white text-ink-muted border border-sand"}`}>
                          {s}×
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="h-2 bg-sand rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const p = ((e.clientX - rect.left) / rect.width) * 100;
                      setProgress(p); setActivePara(Math.floor((p / 100) * MOCK_DOC.paragraphs.length));
                    }}>
                      <div className="h-full bg-sage rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-ink-muted">
                      <span>{Math.floor(progress / 100 * 120)}s</span><span>~2:00</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={() => { setProgress(0); setActivePara(0); }} data-testid="listen-skip-back"
                      className="p-2 text-ink-muted hover:text-ink"><SkipBack className="w-5 h-5" /></button>
                    <button onClick={() => setPlaying(!playing)} data-testid="listen-play-btn"
                      className="w-12 h-12 bg-sage rounded-full flex items-center justify-center text-white hover:bg-sage-hover transition-colors shadow-soft">
                      {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <button onClick={() => { setProgress(100); setPlaying(false); }} data-testid="listen-skip-fwd"
                      className="p-2 text-ink-muted hover:text-ink"><SkipForward className="w-5 h-5" /></button>
                  </div>
                </div>

                {/* Highlighted text */}
                <div className="space-y-4">
                  {MOCK_DOC.paragraphs.map((p, i) => (
                    <div key={i} className={`p-4 rounded-xl border transition-all duration-300 ${
                      i === activePara && playing ? "bg-sage-light border-sage/30" : "bg-[#FAF6F0] border-sand"
                    }`}>
                      <div className="flex items-start gap-3">
                        {i === activePara && playing && <ChevronRight className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />}
                        <p className="text-sm text-ink-secondary leading-relaxed">{p}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Braille Tab */}
            <TabsContent value="braille" className="flex-1 overflow-y-auto p-6 focus:outline-none">
              <div className="max-w-2xl mx-auto">
                <div className="bg-butter-light rounded-2xl p-4 border border-butter/30 mb-6">
                  <p className="text-sm text-[#A0732A]">
                    <strong>Braille Mode:</strong> Text is rendered in Grade 1 Unicode Braille. Optimized for refreshable Braille display devices.
                  </p>
                </div>

                <div className="space-y-8">
                  {MOCK_DOC.paragraphs.map((p, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }} className="p-6 bg-[#FAF6F0] rounded-2xl border border-sand"
                      data-testid={`braille-para-${i}`}
                    >
                      <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-3">Paragraph {i + 1}</p>
                      <p className="braille-text text-[#2B2D42] leading-loose" aria-label={p}>
                        {toBraille(p)}
                      </p>
                      <p className="text-xs text-ink-muted mt-3 leading-relaxed">{p}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
