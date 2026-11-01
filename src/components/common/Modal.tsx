import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tag?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  tag,
  children,
  maxWidth = 'max-w-4xl',
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
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${maxWidth} bg-[#0b0b12] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto z-10 flex flex-col max-h-[92vh]`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/10 bg-[#0e0e18]/95 backdrop-blur-xl sticky top-0 z-20">
              <div className="flex items-center gap-3">
                {tag && (
                  <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-acid/15 text-acid border border-acid/30 font-bold">
                    {tag}
                  </span>
                )}
                <h3 className="font-display font-black text-lg sm:text-xl text-white truncate max-w-[280px] sm:max-w-md">
                  {title}
                </h3>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2.5 rounded-xl bg-[#161622] text-[#8E8E98] hover:text-white hover:bg-white/10 transition border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-acid cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="p-6 sm:p-8 md:p-10 overflow-y-auto text-[#A1A1AA] leading-relaxed space-y-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
