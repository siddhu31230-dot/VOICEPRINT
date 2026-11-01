import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, KeyRound, Cpu, ShieldCheck, EyeOff, Sparkles } from 'lucide-react';

interface SecurityTransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityTransparencyModal: React.FC<SecurityTransparencyModalProps> = ({
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
      document.body.setAttribute('data-modal-open', 'true');

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        document.body.removeAttribute('data-modal-open');
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
      document.body.removeAttribute('data-modal-open');
    }
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#0c0c12] border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-left"
          >
            {/* Header */}
            <div className="p-6 sm:p-7 border-b border-white/10 flex items-start justify-between gap-4 bg-gradient-to-r from-[#12121c] to-[#0c0c12]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-acid" />
                  <span className="font-mono text-xs uppercase tracking-widest text-acid font-bold">
                    TRANSPARENCY & TRUST DISCLOSURES
                  </span>
                </div>
                <h2 className="font-display font-black text-2xl text-white tracking-tight">
                  Security & AI Transparency
                </h2>
                <p className="text-xs text-[#8E8E98] font-mono mt-1">
                  VOICEPRINT Architecture // Wispr Flow India Hiring Challenge
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8E8E98] hover:text-white transition flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-7 space-y-6 max-h-[72vh] overflow-y-auto text-sm leading-relaxed text-[#D4D4D8]">
              {/* Section 1: Client-Side Key Lifetime */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#101018] border border-white/10 space-y-2">
                <div className="flex items-center gap-2.5 text-white font-semibold">
                  <KeyRound className="w-4 h-4 text-acid flex-shrink-0" />
                  <h3 className="font-mono text-sm tracking-wide text-white">
                    1. Client-Side Key Lifetime
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#A1A1AA] pl-6 leading-relaxed">
                  Encryption keys are held in browser memory and are not persistently stored by the application. Refreshing the page, closing the tab or ending the session may discard the active key. Users must retain their passphrase or securely export their backup key to recover encrypted data later.
                </p>
              </div>

              {/* Section 2: Local AI Fallback */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#101018] border border-white/10 space-y-2">
                <div className="flex items-center gap-2.5 text-white font-semibold">
                  <Cpu className="w-4 h-4 text-acid flex-shrink-0" />
                  <h3 className="font-mono text-sm tracking-wide text-white">
                    2. Local AI Fallback
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#A1A1AA] pl-6 leading-relaxed">
                  When <code className="text-acid font-mono text-xs bg-black/40 px-1 py-0.5 rounded">GEMMA_API_KEY</code> is not configured or the remote provider is unavailable, VOICEPRINT uses deterministic responses grounded in its approved portfolio knowledge base. These responses are not generated by a live Gemma 4 inference session.
                </p>
              </div>

              {/* Section 3: No Formal Security Certification */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#101018] border border-white/10 space-y-2">
                <div className="flex items-center gap-2.5 text-white font-semibold">
                  <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <h3 className="font-mono text-sm tracking-wide text-white">
                    3. No Formal Security Certification
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#A1A1AA] pl-6 leading-relaxed">
                  VOICEPRINT implements selected modern security practices, including AES-256-GCM authenticated encryption, PBKDF2-based key derivation, server-side credential isolation and API input validation. These implementations have undergone local automated testing but have not received independent security certification or a formal penetration test. VOICEPRINT does not claim SOC 2 or ISO 27001 certification.
                </p>
              </div>

              {/* Section 4: AI Provider Privacy */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#101018] border border-white/10 space-y-2">
                <div className="flex items-center gap-2.5 text-white font-semibold">
                  <EyeOff className="w-4 h-4 text-acid flex-shrink-0" />
                  <h3 className="font-mono text-sm tracking-wide text-white">
                    4. AI Provider Privacy
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#A1A1AA] pl-6 leading-relaxed">
                  When remote Gemma inference is enabled, recruiter questions are sent to the configured AI provider through the VOICEPRINT backend. Users should not submit passwords, encryption keys or other confidential information through Ask Me. Data handling is subject to the configured provider's privacy and retention policies.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 sm:p-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0a0a0f]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#71717A]">
                <Sparkles className="w-3.5 h-3.5 text-acid" />
                <span>Verified for Wispr Flow Hiring Review</span>
              </div>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-acid text-black font-mono font-bold text-xs rounded-xl hover:bg-white transition"
              >
                Acknowledge & Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
