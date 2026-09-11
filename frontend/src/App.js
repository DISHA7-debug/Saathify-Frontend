import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import InteractionModes from "./components/InteractionModes";
import MeetDost from "./components/MeetDost";
import ISLRecognitionSection from "./components/ISLRecognitionSection";
import LiveCommSection from "./components/LiveCommSection";
import LearningBraille from "./components/LearningBraille";
import ISLAvatarShowcase from "./components/ISLAvatarShowcase";
import DesktopAvatar from "./components/DesktopAvatar";
import AccessibilitySettingsPanel from "./components/AccessibilitySettingsPanel";
import Footer from "./components/Footer";

import DostAI from "./components/DostAI";
import VoiceNavIndicator from "./components/VoiceNavIndicator";
import ISLCameraWorkspace from "./components/workspaces/ISLCameraWorkspace";
import LiveCommWorkspace from "./components/workspaces/LiveCommWorkspace";
import DocumentReaderWorkspace from "./components/workspaces/DocumentReaderWorkspace";
import AccessibilityDrawer from "./components/AccessibilityDrawer";

const defaultA11y = {
  fontSize: "md",
  dyslexicFont: false,
  highContrast: false,
  reduceMotion: false,
  captions: true,
  voiceNav: false,
};

function App() {
  const [workspace, setWorkspace] = useState(null);
  const [isDostOpen, setIsDostOpen] = useState(false);
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [voiceState, setVoiceState] = useState("off");
  const [voiceCommand, setVoiceCommand] = useState("");
  const [a11y, setA11y] = useState(defaultA11y);

  useEffect(() => {
    document.documentElement.setAttribute("data-font-size", a11y.fontSize);
    document.documentElement.setAttribute("data-dyslexic", a11y.dyslexicFont);
    document.documentElement.setAttribute("data-high-contrast", a11y.highContrast);
  }, [a11y]);

  const openWorkspace = (id) => setWorkspace(id);
  const closeWorkspace = () => setWorkspace(null);

  return (
    <BrowserRouter>
      <div
        className="App min-h-screen bg-cream"
        style={{ fontFamily: a11y.dyslexicFont ? "OpenDyslexic, sans-serif" : undefined }}
      >
        <Navbar
          onA11yOpen={() => setIsA11yOpen(true)}
          onDostOpen={() => setIsDostOpen(true)}
          onISLClick={() => openWorkspace("isl")}
          onLiveClick={() => openWorkspace("live")}
          onDocClick={() => openWorkspace("doc")}
        />

        <VoiceNavIndicator
          state={voiceState}
          command={voiceCommand}
          onToggle={() => {
            if (voiceState === "off") {
              setVoiceState("listening");
            } else {
              setVoiceState("off");
              setVoiceCommand("");
            }
          }}
        />

        <main>
          <Hero
            onISLClick={() => openWorkspace("isl")}
            onDostClick={() => setIsDostOpen(true)}
            onLiveClick={() => openWorkspace("live")}
          />
          <InteractionModes />
          <MeetDost onDostOpen={() => setIsDostOpen(true)} />
          <ISLRecognitionSection onTryClick={() => openWorkspace("isl")} />
          <LiveCommSection onOpenClick={() => openWorkspace("live")} />
          <LearningBraille onOpenClick={() => openWorkspace("doc")} />
          <ISLAvatarShowcase />
          <DesktopAvatar />
          <AccessibilitySettingsPanel
            settings={a11y}
            onChange={setA11y}
            onDrawerOpen={() => setIsA11yOpen(true)}
          />
          <Footer />
        </main>

        {/* Floating Dost AI */}
        <DostAI
          isOpen={isDostOpen}
          onClose={() => setIsDostOpen(false)}
          onOpen={() => setIsDostOpen(true)}
        />

        {/* Accessibility Drawer */}
        <AccessibilityDrawer
          isOpen={isA11yOpen}
          onClose={() => setIsA11yOpen(false)}
          settings={a11y}
          onChange={setA11y}
        />

        {/* Workspace Overlays — AnimatePresence lets each one's own exit
            transition play instead of unmounting instantly on close. */}
        <AnimatePresence>
          {workspace === "isl" && <ISLCameraWorkspace key="isl" onClose={closeWorkspace} />}
          {workspace === "live" && <LiveCommWorkspace key="live" onClose={closeWorkspace} />}
          {workspace === "doc" && <DocumentReaderWorkspace key="doc" onClose={closeWorkspace} />}
        </AnimatePresence>

        <Toaster position="top-right" richColors />
      </div>
    </BrowserRouter>
  );
}

export default App;
