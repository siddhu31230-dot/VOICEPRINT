import React, { useState, useRef } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { SocialLinks } from '../../types';
import { MagneticButton } from '../common/MagneticButton';
import { VoiceDictationButton } from '../voice/VoiceDictationButton';
import {
  generateAes256GcmKey,
  deriveKeyFromPassphrase,
  encryptData,
  exportKeyToBase64,
  EncryptedEnvelope
} from '../../utils/crypto';
import confetti from 'canvas-confetti';
import {
  Mail,
  Send,
  Linkedin,
  Github,
  Instagram,
  Globe,
  Settings,
  Copy,
  Check,
  Sparkles,
  ArrowUpRight,
  Lock,
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
  Headphones
} from 'lucide-react';

interface ContactSectionProps {
  links: SocialLinks;
  onOpenConfigLinks: () => void;
  onOpenTransparencyModal?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  links,
  onOpenConfigLinks,
  onOpenTransparencyModal,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Wispr Flow Team / Hiring Evaluator',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // Client-Side AES-256-GCM Vault State
  const [encryptEnabled, setEncryptEnabled] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [encryptedEnvelope, setEncryptedEnvelope] = useState<EncryptedEnvelope | null>(null);
  const [rawKeyBackup, setRawKeyBackup] = useState<string | null>(null);
  const [showRawKey, setShowRawKey] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleEncryptMessage = async () => {
    if (!formData.message.trim()) return;
    setIsEncrypting(true);
    try {
      let key: CryptoKey;
      let salt: Uint8Array | undefined;

      if (passphrase.trim()) {
        const derived = await deriveKeyFromPassphrase(passphrase.trim());
        key = derived.key;
        salt = derived.salt;
        setRawKeyBackup(null);
      } else {
        key = await generateAes256GcmKey();
        const b64Key = await exportKeyToBase64(key);
        setRawKeyBackup(b64Key);
      }

      const envelope = await encryptData(formData.message.trim(), key, salt);
      setEncryptedEnvelope(envelope);
    } catch (err) {
      console.error('Encryption failed:', err);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let mailSubject = `VOICEPRINT Portfolio Inquiry - ${formData.role}`;
    let mailBody = `Name: ${formData.name}\nEmail: ${formData.email}\nRole: ${formData.role}\n\n`;

    if (encryptedEnvelope) {
      mailBody += `--- AES-256-GCM ENCRYPTED PAYLOAD ---\n${JSON.stringify(
        encryptedEnvelope,
        null,
        2
      )}\n\n(Decrypt using your shared passphrase or the exported raw key in browser memory)`;
    } else {
      mailBody += `Message:\n${formData.message}`;
    }

    const mailtoUrl = `mailto:${links.email}?subject=${encodeURIComponent(
      mailSubject
    )}&body=${encodeURIComponent(mailBody)}`;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#D4FF00', '#FFFFFF', '#4ADE80'],
    });

    window.open(mailtoUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="contact" className="scroll-mt-28 py-24 sm:py-28 border-t border-white/10 bg-[#070709] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="07 // INITIATE DIALOGUE"
          tag="Direct Lines & Secure Dispatch"
          title="LET'S TURN IDEAS INTO SOMETHING PEOPLE CAN HEAR."
          subtitle="Whether you are evaluating my submission for Wispr Flow's India growth team, exploring technical collaborations, or discussing distributed systems, my inbox is open."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-10">
          {/* Left Column: Direct Coordinates & Socials (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Email Card */}
            <div className="p-7 rounded-3xl bg-[#09090e] border border-white/10 relative overflow-hidden shadow-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-acid block mb-2 font-bold">
                PRIMARY DIRECT FREQUENCY
              </span>
              <div className="flex items-center justify-between gap-3">
                <a
                  href={`mailto:${links.email}`}
                  className="font-display font-bold text-lg sm:text-xl text-white hover:text-acid transition truncate"
                >
                  {links.email}
                </a>
                <button
                  onClick={() => handleCopy(links.email, 'email')}
                  className="p-2.5 rounded-xl bg-[#141420] border border-white/10 hover:border-acid text-[#8E8E98] hover:text-acid transition shrink-0"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copiedField === 'email' ? <Check className="w-4 h-4 text-acid" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Social Grid */}
            <div className="p-7 rounded-3xl bg-[#09090e] border border-white/10 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-mono text-xs uppercase tracking-widest text-[#8E8E98] font-bold">
                  VERIFIED IDENTIFIERS
                </span>
                <button
                  onClick={onOpenConfigLinks}
                  className="text-xs font-mono text-acid hover:underline flex items-center gap-1 font-semibold"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure URLs</span>
                </button>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                {/* LinkedIn Item */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#101018] border border-white/10">
                  <div className="flex items-center gap-2.5 text-white truncate mr-2">
                    <Linkedin className="w-4 h-4 text-acid shrink-0" />
                    <span className="truncate">{links.linkedin}</span>
                  </div>
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#71717A] hover:text-acid shrink-0 p-1"
                    aria-label="LinkedIn profile"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                {/* GitHub Item */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#101018] border border-white/10">
                  <div className="flex items-center gap-2.5 text-white truncate mr-2">
                    <Github className="w-4 h-4 text-acid shrink-0" />
                    <span className="truncate">{links.github}</span>
                  </div>
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#71717A] hover:text-acid shrink-0 p-1"
                    aria-label="GitHub profile"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Instagram Item */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#101018] border border-white/10">
                  <div className="flex items-center gap-2.5 text-white truncate mr-2">
                    <Instagram className="w-4 h-4 text-acid shrink-0" />
                    <span className="truncate">{links.instagram}</span>
                  </div>
                  <a
                    href={links.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#71717A] hover:text-acid shrink-0 p-1"
                    aria-label="Instagram profile"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Builder Manifesto Card */}
            <div className="p-7 rounded-3xl bg-acid/10 border border-acid/25 space-y-2 shadow-xl">
              <span className="font-mono text-[10px] text-acid uppercase tracking-widest block font-bold">
                THE CLOSING THOUGHT
              </span>
              <p className="font-display font-black text-xl text-white">
                "Let's turn ideas into something people can hear."
              </p>
              <p className="text-xs text-[#A1A1AA] font-sans leading-relaxed">
                {PERSONAL_INFO.supportingMessage}
              </p>
            </div>
          </div>

          {/* Right Column: Recruiter Direct Dispatch (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-10 rounded-3xl bg-[#09090e] border border-white/10 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-acid animate-ping" />
                  <h3 className="font-display font-bold text-xl text-white">
                    Recruiter Direct Dispatch
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#71717A]">
                  Dispatches via Mail Client
                </span>
              </div>

              {submitted ? (
                <div className="p-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-acid/20 border border-acid text-acid flex items-center justify-center mx-auto shadow-lg shadow-acid/20">
                    <Check className="w-7 h-7" />
                  </div>
                  <h4 className="font-display font-black text-2xl text-white">
                    Message Dispatched!
                  </h4>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto font-sans">
                    Your email client has opened with the structured message. Siddharth typically responds within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 text-xs font-mono rounded-xl bg-[#141420] text-acid border border-acid/40 hover:bg-acid hover:text-black transition"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[#A1A1AA] uppercase">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Mercer"
                        className="w-full px-4 py-3 bg-[#101018] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-acid transition shadow-inner"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#A1A1AA] uppercase">Your Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full px-4 py-3 bg-[#101018] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-acid transition shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#A1A1AA] uppercase">Your Role / Organization</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 bg-[#101018] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-acid transition"
                    >
                      <option value="Wispr Flow Team / Hiring Evaluator">Wispr Flow Team / Hiring Evaluator</option>
                      <option value="Product / Engineering Recruiter">Product / Engineering Recruiter</option>
                      <option value="Startup Founder / Co-builder">Startup Founder / Co-builder</option>
                      <option value="Other Inquirer">Other General Inquiry</option>
                    </select>
                  </div>

                  {/* Project Note with Voice Dictation Button */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[#A1A1AA] uppercase">Project Note / Inquiry</label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#71717A]">Voice Typing:</span>
                        <VoiceDictationButton
                          onTranscript={(spoken) => {
                            setFormData((prev) => ({
                              ...prev,
                              message: prev.message ? `${prev.message} ${spoken}` : spoken,
                            }));
                          }}
                          placeholderPrompt="Dictating note into message..."
                        />
                      </div>
                    </div>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Siddharth, reviewed your VOICEPRINT portfolio for the Wispr Flow challenge. Let's schedule a call to discuss your projects..."
                      className="w-full px-4 py-3 bg-[#101018] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-acid transition leading-relaxed font-sans text-xs sm:text-sm"
                    />
                  </div>

                  {/* Client-Side AES-256-GCM Encryption Vault Option */}
                  <div className="p-4 rounded-2xl bg-[#0a0a14] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-acid" />
                        <span className="font-mono text-xs font-bold text-white uppercase">
                          Client-Side Cryptographic Vault
                        </span>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={encryptEnabled}
                          onChange={(e) => {
                            setEncryptEnabled(e.target.checked);
                            if (!e.target.checked) setEncryptedEnvelope(null);
                          }}
                          className="accent-acid w-4 h-4 rounded"
                        />
                        <span className="text-[11px] font-mono text-[#A1A1AA]">
                          Enable AES-256-GCM
                        </span>
                      </label>
                    </div>

                    {encryptEnabled && (
                      <div className="space-y-2.5 pt-2 border-t border-white/5 font-mono text-[11px]">
                        <div className="flex items-center justify-between text-[#8E8E98]">
                          <span>
                            Encrypt your note locally before dispatching. Keys exist strictly in your browser memory and are never sent to any server or AI model.
                          </span>
                          {onOpenTransparencyModal && (
                            <button
                              type="button"
                              onClick={onOpenTransparencyModal}
                              className="text-acid underline text-[10px] shrink-0 ml-2"
                            >
                              Transparency Report
                            </button>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="password"
                            value={passphrase}
                            onChange={(e) => setPassphrase(e.target.value)}
                            placeholder="Optional custom passphrase (or leave empty for auto 256-bit key)"
                            className="flex-1 px-3 py-2 rounded-xl bg-[#141424] border border-white/10 text-white placeholder-[#71717A] text-xs focus:outline-none focus:border-acid"
                          />
                          <button
                            type="button"
                            onClick={handleEncryptMessage}
                            disabled={isEncrypting || !formData.message.trim()}
                            className="px-4 py-2 rounded-xl bg-acid/20 text-acid border border-acid/40 hover:bg-acid hover:text-black transition disabled:opacity-50 text-xs font-bold flex items-center justify-center gap-1.5 shrink-0"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>{isEncrypting ? 'Encrypting...' : 'Encrypt Payload'}</span>
                          </button>
                        </div>

                        {encryptedEnvelope && (
                          <div className="p-3 rounded-xl bg-[#111122] border border-acid/30 space-y-1.5 animate-fade-in">
                            <div className="flex items-center justify-between text-acid font-bold">
                              <span className="flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Payload Encrypted (AES-256-GCM)</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(JSON.stringify(encryptedEnvelope), 'envelope')}
                                className="text-white hover:text-acid flex items-center gap-1 text-[10px]"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy JSON</span>
                              </button>
                            </div>

                            <div className="text-[10px] text-[#71717A] space-y-0.5">
                              <div>IV: <span className="text-white">{encryptedEnvelope.iv}</span></div>
                              <div className="truncate">Ciphertext: <span className="text-[#A1A1AA]">{encryptedEnvelope.ciphertext}</span></div>
                            </div>

                            {rawKeyBackup && (
                              <div className="pt-1.5 text-[10px] text-amber-300 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span>Auto-Generated 256-bit Key:</span>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setShowRawKey(!showRawKey)}
                                      className="text-white hover:text-acid flex items-center gap-1 text-[10px]"
                                    >
                                      {showRawKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                      <span>{showRawKey ? 'Hide' : 'Reveal'}</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(rawKeyBackup, 'rawKey')}
                                      className="text-white hover:text-acid flex items-center gap-1 text-[10px]"
                                    >
                                      {copiedField === 'rawKey' ? <Check className="w-3 h-3 text-acid" /> : <Copy className="w-3 h-3" />}
                                      <span>Copy</span>
                                    </button>
                                  </div>
                                </div>
                                <code className="block bg-black/80 px-2 py-1 rounded text-white break-all font-mono">
                                  {showRawKey ? rawKeyBackup : '••••••••••••••••••••••••••••••••••••••••••••'}
                                </code>
                                <span className="block text-[9px] text-[#71717A] leading-tight">
                                  ⚠️ Security Notice: Save this key in a secure manager if you need to decrypt this note later. It is stored strictly in browser memory and vanishes on page reload.
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <MagneticButton strength={0.2} className="w-full block">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-acid text-black font-display font-black text-xs tracking-wider hover:bg-[#E5FF4D] transition flex items-center justify-center gap-2 shadow-xl shadow-acid/20"
                    >
                      <Send className="w-4 h-4" />
                      <span>DISPATCH DIRECT MESSAGE</span>
                    </button>
                  </MagneticButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};