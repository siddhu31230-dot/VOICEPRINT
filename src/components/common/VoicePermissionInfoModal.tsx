import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, ShieldCheck, AlertCircle, Info, Sparkles, CheckCircle2 } from 'lucide-react';

interface VoicePermissionInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoicePermissionInfoModal: React.FC<VoicePermissionInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-[#0c0c12] border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-left"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-gradient-to-r from-[#141422] to-[#0c0c12]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-acid/15 border border-acid/30 text-acid">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">
                    Microphone & Voice Privacy
                  </h3>
                  <p className="text-xs font-mono text-acid">
                    Web Speech API Security Invariants
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8E8E98] hover:text-white transition flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[68vh] overflow-y-auto text-xs sm:text-sm text-[#D4D4D8] leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#101018] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <ShieldCheck className="w-4 h-4 text-acid shrink-0" />
                  <span>On-Demand Microphone Permission</span>
                </div>
                <p className="text-[#A1A1AA] text-xs leading-relaxed pl-6">
                  VOICEPRINT only accesses your microphone when you actively tap the microphone button. Your browser will prompt you with standard permission controls.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#101018] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-acid shrink-0" />
                  <span>Zero Audio Recording or Storage</span>
                </div>
                <p className="text-[#A1A1AA] text-xs leading-relaxed pl-6">
                  Microphone audio is transcribed into text in real time. No raw audio recordings or audio blobs are stored in memory, saved in cookies/localStorage, or uploaded to any server.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#101018] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <AlertCircle className="w-4 h-4 text-acid shrink-0" />
                  <span>No Background Listening</span>
                </div>
                <p className="text-[#A1A1AA] text-xs leading-relaxed pl-6">
                  The microphone automatically closes as soon as speech recognition completes or when you click Stop or Cancel. Continuous background listening is never performed.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Independent Voice Technology Notice</span>
                </div>
                <p className="text-[#D4D4D8] leading-relaxed pl-6">
                  In-browser voice commands utilize the standard W3C Web Speech API. Wispr Flow is a standalone desktop AI application featured as an engineering case study in the Voice Lab section.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-white/10 flex items-center justify-between bg-[#0a0a0f]">
              <span className="text-xs font-mono text-[#71717A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-acid" />
                <span>Full User Control Maintained</span>
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-acid text-black font-mono font-bold text-xs rounded-xl hover:bg-white transition"
              >
                Understood
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
