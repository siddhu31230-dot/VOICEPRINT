import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { OriginSection } from './components/sections/OriginSection';
import { HowIThinkSection } from './components/sections/HowIThinkSection';
import { ExperimentsSection } from './components/sections/ExperimentsSection';
import { VoiceLabSection } from './components/sections/VoiceLabSection';
import { WhyWisprFlowSection } from './components/sections/WhyWisprFlowSection';
import { GrowthArenaSection } from './components/sections/GrowthArenaSection';
import { AskMeAnythingSection } from './components/sections/AskMeAnythingSection';
import { BehindTheBuildSection } from './components/sections/BehindTheBuildSection';
import { NextChapterSection } from './components/sections/NextChapterSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/layout/Footer';
import { ConfigurableLinksModal } from './components/common/ConfigurableLinksModal';
import { SecurityTransparencyModal } from './components/common/SecurityTransparencyModal';
import { FloatingVoiceAssistant } from './components/voice/FloatingVoiceAssistant';
import { FullScreenVoiceAssistant } from './components/voice/FullScreenVoiceAssistant';
import { INITIAL_SOCIAL_LINKS } from './data/portfolioData';
import { SocialLinks } from './types';

export const App: React.FC = () => {
  const [links, setLinks] = useState<SocialLinks>(() => {
    try {
      const saved = localStorage.getItem('voiceprint_links');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return INITIAL_SOCIAL_LINKS;
  });

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isCaseStudyModalOpen, setIsCaseStudyModalOpen] = useState(false);
  const [isTransparencyModalOpen, setIsTransparencyModalOpen] = useState(false);
  const [isFullScreenVoiceOpen, setIsFullScreenVoiceOpen] = useState(false);
  const [activeAudio, setActiveAudio] = useState(false);

  // Web Audio Context for subtle ambient resonance
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const handleToggleAudio = () => {
    if (!activeAudio) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }

        const osc = audioContextRef.current.createOscillator();
        const gain = audioContextRef.current.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, audioContextRef.current.currentTime); // Low warm hum

        // Very subtle volume (inaudible unless listening for harmonic floor)
        gain.gain.setValueAtTime(0.015, audioContextRef.current.currentTime);

        osc.connect(gain);
        gain.connect(audioContextRef.current.destination);
        osc.start();

        oscillatorRef.current = osc;
        gainNodeRef.current = gain;
        setActiveAudio(true);
      } catch (err) {
        console.warn('AudioContext not allowed or supported', err);
        setActiveAudio(true);
      }
    } else {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (e) {}
        oscillatorRef.current = null;
      }
      setActiveAudio(false);
    }
  };

  const handleSaveLinks = (updated: SocialLinks) => {
    setLinks(updated);
    try {
      localStorage.setItem('voiceprint_links', JSON.stringify(updated));
    } catch (e) {}
  };

  const isAnyModalOpen =
    isConfigModalOpen || isCaseStudyModalOpen || isTransparencyModalOpen || isFullScreenVoiceOpen;

  return (
    <div className="min-h-screen bg-[#08080a] text-[#F4F4F6] relative selection:bg-acid selection:text-black">
      {/* Navbar with auto-concealment when any modal is open */}
      <Navbar
        activeAudio={activeAudio}
        onToggleAudio={handleToggleAudio}
        onOpenConfigLinks={() => setIsConfigModalOpen(true)}
        onOpenVoiceAssistant={() => setIsFullScreenVoiceOpen(true)}
        isModalOpen={isAnyModalOpen}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <HeroSection
          activeAudio={activeAudio}
          onToggleAudio={handleToggleAudio}
          onOpenVoiceAssistant={() => setIsFullScreenVoiceOpen(true)}
        />
        <OriginSection
          onOpenConfigLinks={() => setIsConfigModalOpen(true)}
        />
        <HowIThinkSection />
        <ExperimentsSection
          onModalStateChange={setIsCaseStudyModalOpen}
        />
        <VoiceLabSection />
        <WhyWisprFlowSection />
        <GrowthArenaSection />
        <AskMeAnythingSection
          onOpenTransparencyModal={() => setIsTransparencyModalOpen(true)}
        />
        <BehindTheBuildSection />
        <NextChapterSection />
        <ContactSection
          links={links}
          onOpenConfigLinks={() => setIsConfigModalOpen(true)}
          onOpenTransparencyModal={() => setIsTransparencyModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        links={links}
        onOpenConfigLinks={() => setIsConfigModalOpen(true)}
        onOpenTransparencyModal={() => setIsTransparencyModalOpen(true)}
      />

      {/* Floating AI Voice Assistant */}
      <FloatingVoiceAssistant
        onOpenFullScreen={() => setIsFullScreenVoiceOpen(true)}
      />

      {/* Immersive Fullscreen Voice Experience */}
      <FullScreenVoiceAssistant
        isOpen={isFullScreenVoiceOpen}
        onClose={() => setIsFullScreenVoiceOpen(false)}
      />

      {/* Configurable Profile Links Modal */}
      <ConfigurableLinksModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        links={links}
        onSave={handleSaveLinks}
      />

      {/* Security & AI Transparency Disclosures Modal */}
      <SecurityTransparencyModal
        isOpen={isTransparencyModalOpen}
        onClose={() => setIsTransparencyModalOpen(false)}
      />
    </div>
  );
};

export default App;