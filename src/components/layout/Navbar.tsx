import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Sparkles, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  activeAudio: boolean;
  onToggleAudio: () => void;
  onOpenConfigLinks: () => void;
  isModalOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeAudio,
  onToggleAudio,
  onOpenConfigLinks,
  isModalOpen = false,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const navLinks = [
    { label: 'Origin', href: '#origin' },
    { label: 'Experiments', href: '#experiments' },
    { label: 'Voice Lab', href: '#voice-lab', highlight: true },
    { label: 'Growth Arena', href: '#growth-arena' },
    { label: 'Ask Me', href: '#ask-me' },
    { label: 'Contact', href: '#contact' },
  ];

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  // Scroll direction and progress detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);

      // Smart direction detection (hide on scroll down, show on scroll up)
      if (scrollY < 60) {
        setIsVisible(true);
      } else {
        const diff = scrollY - lastScrollY.current;
        if (diff > 8) {
          // Scrolling down
          setIsVisible(false);
        } else if (diff < -8) {
          // Scrolling up
          setIsVisible(true);
        }
      }
      lastScrollY.current = scrollY;

      // Active section calculation with generous trigger line
      const sections = ['home', 'origin', 'experiments', 'voice-lab', 'growth-arena', 'ask-me', 'next-chapter', 'contact'];
      const scrollPosition = scrollY + 220;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Scroll Progress Indicator Line */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#14141e] z-50">
        <div
          className="h-full bg-acid shadow-[0_0_12px_#D4FF00] transition-all duration-75 origin-left"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Navigation Dock Header */}
      <header
        className={`fixed top-4 left-0 right-0 z-40 transition-all duration-300 px-4 sm:px-6 pointer-events-none ${
          isModalOpen || (!isVisible && !mobileMenuOpen)
            ? '-translate-y-32 opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Wordmark Pill */}
          <a
            href="#home"
            className="pointer-events-auto group flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#09090f]/90 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-acid/40 transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-lg bg-black border border-acid/40 flex items-center justify-center group-hover:border-acid transition-all duration-300 overflow-hidden relative">
              <div className="flex items-center gap-0.5">
                <span className="w-0.5 h-3 bg-acid rounded-full animate-wave-bar" />
                <span
                  className="w-0.5 h-4 bg-acid rounded-full animate-wave-bar"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="w-0.5 h-2 bg-acid rounded-full animate-wave-bar"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-display font-black text-sm tracking-tight text-white group-hover:text-acid transition">
                VOICEPRINT
              </span>
              <span className="font-mono text-[9px] tracking-widest text-[#8E8E98] uppercase">
                SIDDHARTH SINGH
              </span>
            </div>
          </a>

          {/* Central Dock Navigation */}
          <nav className="pointer-events-auto hidden md:flex items-center gap-1 bg-[#09090f]/90 backdrop-blur-xl border border-white/10 px-2 py-1.5 rounded-full shadow-2xl">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'text-black font-bold'
                      : link.highlight
                      ? 'text-acid hover:text-white'
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDockPill"
                      className="absolute inset-0 bg-acid rounded-full shadow-[0_0_15px_rgba(212,255,0,0.3)] z-0"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.highlight && !isActive && <span className="w-1.5 h-1.5 rounded-full bg-acid animate-ping" />}
                    {link.label}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Right Controls Pill */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={onToggleAudio}
              title={activeAudio ? 'Mute ambient soundwave resonance' : 'Unmute ambient soundwave resonance'}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl backdrop-blur-xl border transition-all duration-200 flex items-center gap-2 text-xs font-mono shadow-2xl ${
                activeAudio
                  ? 'border-acid/60 bg-acid/15 text-acid shadow-[0_0_15px_rgba(212,255,0,0.2)]'
                  : 'border-white/10 bg-[#09090f]/90 text-[#8E8E98] hover:text-white hover:border-white/20'
              }`}
            >
              {activeAudio ? (
                <Volume2 className="w-4 h-4 text-acid animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <span className="hidden lg:inline text-[11px] font-semibold">
                {activeAudio ? 'AUDIO ON' : 'AUDIO OFF'}
              </span>
            </button>

            {/* Quick Action Pill */}
            <a
              href="#voice-lab"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-acid text-black font-display font-black text-xs hover:bg-[#E5FF4D] transition shadow-lg shadow-acid/20"
            >
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>WISPR SPRINT</span>
            </a>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-[#09090f]/95 backdrop-blur-xl border border-white/10 text-white shadow-2xl focus:outline-none focus:ring-2 focus:ring-acid"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-acid" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Drawer with Backdrop Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="pointer-events-auto fixed inset-0 z-50 flex items-start justify-center p-4 pt-16">
              {/* Fullscreen Blurred Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/85 backdrop-blur-xl"
              />

              {/* Menu Container Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -15 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-sm p-6 bg-[#09090e] border border-white/15 rounded-3xl shadow-2xl space-y-4 z-10"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-acid animate-ping" />
                    <span className="font-mono text-xs text-acid uppercase tracking-wider font-bold">
                      Navigation Menu
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close Navigation Menu"
                    className="p-1.5 rounded-lg bg-white/5 text-[#8E8E98] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl text-base font-display font-bold text-[#E4E4E7] hover:text-black hover:bg-acid transition-all duration-150"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-70" />
                    </a>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenConfigLinks();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-mono text-[#8E8E98] hover:text-acid"
                  >
                    ⚙ Configure Profile Links
                  </button>
                  <a
                    href="#voice-lab"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3.5 text-center text-xs font-mono font-bold bg-acid text-black rounded-2xl shadow-lg shadow-acid/20"
                  >
                    EXPLORE VOICE LAB →
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
