import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, BookOpen, Headphones, Type, Play, Pause, SkipBack, SkipForward, ChevronRight, Upload, AlertCircle, Cpu, CheckCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

const BRAILLE_MAP = {
  a:'⠁',b:'⠃',c:'⠉',d:'⠙',e:'⠑',f:'⠋',g:'⠛',h:'⠓',i:'⠊',j:'⠚',
  k:'⠅',l:'⠇',m:'⠍',n:'⠝',o:'⠕',p:'⠏',q:'⠟',r:'⠗',s:'⠎',t:'⠞',
  u:'⠥',v:'⠧',w:'⠺',x:'⠭',y:'⠽',z:'⠵',' ':'⠀',',':'⠂','.':'⠲','!':'⠖','?':'⠦',
  '0':'⠼⠚','1':'⠼⠁','2':'⠼⠃','3':'⠼⠉','4':'⠼⠙','5':'⠼⠑','6':'⠼⠋','7':'⠼⠛','8':'⠼⠓','9':'⠼⠊'
};

function toBraille(text) {
  if (!text) return "";
  return text.toLowerCase().split('').map(c => BRAILLE_MAP[c] || c).join('');
}

// Isolated Sarvam AI TTS (Bulbul v3) Integration Module (server-side proxy, zero key leak)
export async function speakText({ text, rate = 1, onProgress, onEnd, onError }) {
  try {
    const res = await fetch("/api/sarvam/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, pace: rate, speaker: "shreya" }),
    });

    if (!res.ok) {
      throw new Error("Couldn't generate audio right now — try again");
    }

    const data = await res.json();
    const audiosList = (data.audios && data.audios.length > 0) ? data.audios : (data.audio ? [data.audio] : []);

    if (data.error || audiosList.length === 0) {
      throw new Error(data.error || "Couldn't generate audio right now — try again");
    }

    let currentIndex = 0;
    let currentAudio = null;

    const playChunk = (index) => {
      if (index >= audiosList.length) {
        if (onEnd) onEnd();
        return;
      }

      currentAudio = new Audio(audiosList[index]);
      currentAudio.playbackRate = rate;

      currentAudio.ontimeupdate = () => {
        if (currentAudio.duration && onProgress) {
          const overallProgress = ((index + (currentAudio.currentTime / currentAudio.duration)) / audiosList.length) * 100;
          onProgress(Math.min(overallProgress, 100));
        }
      };

      currentAudio.onended = () => {
        playChunk(index + 1);
      };

      currentAudio.onerror = (err) => {
        if (onError) onError(new Error("Couldn't generate audio right now — try again"));
      };

      currentAudio.play().catch(e => {
        if (onError) onError(e);
      });
    };

    playChunk(0);

    return {
      pause: () => currentAudio && currentAudio.pause(),
      play: () => currentAudio && currentAudio.play(),
      stop: () => {
        if (currentAudio) {
          currentAudio.onended = null;
          currentAudio.onerror = null;
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      },
      isPaused: () => !currentAudio || currentAudio.paused,
      setRate: (r) => { if (currentAudio) currentAudio.playbackRate = r; },
    };
  } catch (err) {
    if (onError) onError(err);
    return null;
  }
}

const DEFAULT_DOC = {
  title: "Understanding Indian Sign Language",
  paragraphs: [
    "Indian Sign Language (ISL) is the primary sign language used by the deaf community in India, with an estimated 5 million users across the country.",
    "ISL has its own grammar, syntax, and vocabulary that differs significantly from spoken Indian languages. It is a rich, expressive language with its own cultural identity.",
    "Learning ISL opens doors to meaningful communication and deeper connections with the deaf and hard-of-hearing community. SaathiFy is here to make that journey accessible to everyone.",
    "The ISL Recognition feature in SaathiFy uses machine learning to identify over 300 signs in real-time, making communication faster and more natural than ever before.",
  ]
};


export default function DocumentReaderWorkspace({ onClose }) {
  const [doc, setDoc] = useState(DEFAULT_DOC);
  const [fileError, setFileError] = useState("");
  const [activeTab, setActiveTab] = useState("read");
  const [fontSize, setFontSize] = useState("md");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [activePara, setActivePara] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const audioRef = useRef(null);
  const utteranceRef = useRef(null);
  // Bumped every time we deliberately stop/replace speech, so a stale
  // end/error event from a cancelled utterance can't clobber newer state
  // (this is what made speed changes flash the error banner).
  const speechGenRef = useRef(0);

  // Stop whichever engine is currently speaking, and mark any in-flight
  // events from it as stale so they're ignored when they arrive.
  const stopAllSpeech = () => {
    speechGenRef.current += 1;
    if (audioRef.current) {
      audioRef.current.stop();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    utteranceRef.current = null;
  };

  // Clean up whichever engine is speaking on unmount or doc change.
  useEffect(() => {
    return () => stopAllSpeech();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setFileError("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-document", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.error || "We couldn't read that file — try a .txt, .pdf, or .docx");
      }

      const parsed = await res.json();
      if (!parsed.text || !parsed.paragraphs || parsed.paragraphs.length === 0) {
        throw new Error("We couldn't read that file — try a .txt, .pdf, or .docx");
      }

      setDoc({
        title: parsed.title || file.name,
        paragraphs: parsed.paragraphs,
        text: parsed.text
      });
      setProgress(0);
      setActivePara(0);
      setPlaying(false);
      stopAllSpeech();
    } catch (err) {
      setFileError(err.message || "We couldn't read that file — try a .txt, .pdf, or .docx");
    }
  };

  // Browser speech fallback, used when the Sarvam proxy can't serve audio
  // (no SARVAM_API_KEY configured, or the upstream call failed). Every modern
  // browser ships a speech engine, so Listen still works without any API key.
  // `rate` and `resumeFrom` (0-100) let a speed change or scrub restart
  // mid-utterance instead of always reading from the top.
  const speakWithBrowser = (fullText, rate, resumeFrom = 0) => {
    if (!('speechSynthesis' in window)) return false;

    const gen = ++speechGenRef.current;
    window.speechSynthesis.cancel();

    const startChar = Math.floor((resumeFrom / 100) * fullText.length);
    const remaining = fullText.slice(startChar);
    const utterance = new window.SpeechSynthesisUtterance(remaining);
    utterance.rate = rate;
    utterance.lang = "en-IN";

    utterance.onboundary = (e) => {
      if (speechGenRef.current !== gen) return; // stale utterance, ignore
      const spoken = startChar + (e.charIndex || 0);
      const p = fullText.length ? Math.min((spoken / fullText.length) * 100, 100) : 0;
      setProgress(p);
      setActivePara(Math.min(Math.floor((p / 100) * doc.paragraphs.length), doc.paragraphs.length - 1));
    };
    utterance.onend = () => {
      if (speechGenRef.current !== gen) return; // superseded by a newer utterance
      setPlaying(false);
      setProgress(100);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      if (speechGenRef.current !== gen) return; // this is the old utterance's
      // cancel() firing error after we already started a replacement — ignore it
      setPlaying(false);
      utteranceRef.current = null;
      setFileError("Couldn't generate audio right now — try again");
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  };

  const handlePlayPause = async () => {
    setFileError("");
    if (playing) {
      if (audioRef.current) {
        audioRef.current.pause();
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      setPlaying(false);
    } else {
      if (audioRef.current && !audioRef.current.isPaused()) {
        // already playing somehow (shouldn't normally happen); nothing to do
        setPlaying(true);
      } else if (audioRef.current) {
        audioRef.current.play();
        setPlaying(true);
      } else if (utteranceRef.current && window.speechSynthesis.paused) {
        // Native resume keeps the paused utterance's original rate, so if the
        // speed was changed while paused, restart at the new rate instead of
        // silently resuming at the stale one.
        if (utteranceRef.current.rate !== speed) {
          speakWithBrowser(doc.paragraphs.join(" "), speed, progress);
        } else {
          window.speechSynthesis.resume();
        }
        setPlaying(true);
      } else {
        const fullText = doc.paragraphs.join(" ");
        const gen = ++speechGenRef.current;
        setPlaying(true);
        const player = await speakText({
          text: fullText,
          rate: speed,
          onProgress: (p) => {
            if (speechGenRef.current !== gen) return;
            setProgress(p);
            setActivePara(Math.min(Math.floor((p / 100) * doc.paragraphs.length), doc.paragraphs.length - 1));
          },
          onEnd: () => {
            if (speechGenRef.current !== gen) return;
            setPlaying(false);
            setProgress(100);
            audioRef.current = null;
          },
          onError: () => {
            if (speechGenRef.current !== gen) return;
            // Sarvam unavailable — read it with the browser's own voice instead,
            // continuing from wherever progress currently is.
            audioRef.current = null;
            if (!speakWithBrowser(fullText, speed, progress)) {
              setPlaying(false);
              setFileError("Couldn't generate audio right now — try again");
            }
          },
        });
        if (player) {
          audioRef.current = player;
        }
      }
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.setRate(newSpeed);
      return;
    }
    // Browser speech can't change rate on a live utterance — restart it at
    // the new speed from the current progress. Only do that if we were
    // actually playing; if paused, just remember the new rate (setSpeed
    // above) and apply it whenever the user presses Play next — restarting
    // here would silently resume playback out from under a paused reader.
    if (utteranceRef.current && playing) {
      speakWithBrowser(doc.paragraphs.join(" "), newSpeed, progress);
    }
  };

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
              <p className="text-xs text-ink-muted">{doc.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              accept=".txt,.pdf,.doc,.docx"
              className="hidden"
            />
            <button
              data-testid="doc-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-terracotta text-white text-sm font-medium rounded-xl hover:bg-terracotta-hover transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4" /> Open Document
            </button>
            <button onClick={onClose} data-testid="doc-workspace-close" className="p-2 rounded-xl hover:bg-[#FAF6F0] text-ink-muted hover:text-ink" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* File Error Alert */}
        {fileError && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center justify-between text-red-700 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{fileError}</span>
            </div>
            <button onClick={() => setFileError("")} className="text-xs font-semibold underline hover:no-underline">Dismiss</button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-h-0 flex flex-col overflow-hidden">
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
            <TabsContent value="read" className="flex-1 min-h-0 overflow-y-auto p-6 focus:outline-none">
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
                  {doc.title}
                </h1>
                {doc.paragraphs.map((p, i) => (
                  <p key={i} className={`${fontSizeClass} text-ink-secondary leading-relaxed mb-5 break-words`}>{p}</p>
                ))}
              </div>
            </TabsContent>

            {/* Listen Tab */}
            <TabsContent value="listen" className="flex-1 min-h-0 overflow-y-auto p-6 focus:outline-none">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Player */}
                <div className="bg-[#FAF6F0] rounded-2xl p-6 border border-sand">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-ink text-sm">{doc.title}</p>
                      <p className="text-xs text-ink-muted">{doc.paragraphs.length} paragraphs · Speech Synthesis Active</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-muted">Speed:</span>
                      {[0.5, 1, 1.5, 2].map((s) => (
                        <button key={s} onClick={() => handleSpeedChange(s)} data-testid={`listen-speed-${s}`}
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
                      setProgress(p); setActivePara(Math.min(Math.floor((p / 100) * doc.paragraphs.length), doc.paragraphs.length - 1));
                    }}>
                      <div className="h-full bg-sage rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={() => { stopAllSpeech(); setProgress(0); setActivePara(0); setPlaying(false); }} data-testid="listen-skip-back"
                      className="p-2 text-ink-muted hover:text-ink"><SkipBack className="w-5 h-5" /></button>
                    <button onClick={handlePlayPause} data-testid="listen-play-btn"
                      className="w-12 h-12 bg-sage rounded-full flex items-center justify-center text-white hover:bg-sage-hover transition-colors shadow-soft">
                      {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <button onClick={() => { stopAllSpeech(); setProgress(100); setPlaying(false); }} data-testid="listen-skip-fwd"
                      className="p-2 text-ink-muted hover:text-ink"><SkipForward className="w-5 h-5" /></button>
                  </div>
                </div>

                {/* Highlighted text */}
                <div className="space-y-4">
                  {doc.paragraphs.map((p, i) => (
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
            <TabsContent value="braille" className="flex-1 min-h-0 overflow-y-auto p-6 focus:outline-none relative">
              <div className="max-w-2xl mx-auto space-y-5 pb-6">
                <div className="flex items-start gap-3 bg-butter-light rounded-2xl p-4 border border-butter/30">
                  <div className="w-8 h-8 rounded-xl bg-white/70 flex items-center justify-center text-[#A0732A] flex-shrink-0">
                    <Type className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-[#A0732A] leading-relaxed">
                    <strong className="font-semibold">Braille Mode</strong> — text converted to Grade&nbsp;1 Unicode Braille, ready for display output.
                  </p>
                </div>

                <div className="space-y-4">
                  {doc.paragraphs.map((p, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }} className="bg-white rounded-2xl border border-sand shadow-soft overflow-hidden"
                      data-testid={`braille-para-${i}`}
                    >
                      <div className="flex items-center gap-2 px-5 pt-4">
                        <span className="w-6 h-6 rounded-full bg-terracotta-light text-terracotta text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold text-ink-muted uppercase tracking-widest">Paragraph</span>
                      </div>
                      <div className="mx-5 mt-3 mb-4 px-4 py-4 bg-[#FAF6F0] rounded-xl border border-sand/70 overflow-x-auto">
                        <p className="braille-text whitespace-nowrap" aria-label={p}>
                          {toBraille(p)}
                        </p>
                      </div>
                      <p className="text-xs text-ink-muted leading-relaxed px-5 pb-4 break-words">{p}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Hardware Insert Status Indicator — pops in from the bottom-right corner */}
              <div className="fixed bottom-6 right-6 z-20 pointer-events-none">
                <motion.div
                  key={activeTab === "braille" ? "braille-status-visible" : "braille-status-hidden"}
                  initial={{ x: 120, y: 60, opacity: 0, scale: 0.85 }}
                  animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 20, mass: 0.9, delay: 0.15 }}
                  className="pointer-events-auto bg-[#1A1A2E] text-white pl-3 pr-4 py-3 rounded-2xl shadow-lift border border-white/10 flex items-center gap-3 max-w-[260px]"
                >
                  <div className="w-8 h-8 rounded-xl bg-sage/20 flex items-center justify-center text-sage flex-shrink-0">
                    <Cpu className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sage">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> Braille Output Generated
                    </div>
                    <p className="text-xs text-white/70 truncate">Ready — insert Braille display device</p>
                  </div>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
