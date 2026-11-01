import React, { useState, useRef } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { SocialLinks } from '../../types';
import { MagneticButton } from '../common/MagneticButton';
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
  Key
} from 'lucide-react';

interface ContactSectionProps {
  links: SocialLinks;
  onOpenConfigLinks: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  links,
  onOpenConfigLinks,
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
        const raw = await exportKeyToBase64(key);
        setRawKeyBackup(raw);
      }

      const env = await encryptData(formData.message, key, salt);
      setEncryptedEnvelope(env);
    } catch (err) {
      console.warn('Encryption failed:', err);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.8 },
      colors: ['#D4FF00', '#ffffff', '#8AA600'],
    });

    setSubmitted(true);
    const subject = encodeURIComponent(
      `Wispr Flow Challenge Inquiry from ${formData.name || 'Recruiter'}${encryptEnabled ? ' [AES-256-GCM Encrypted]' : ''}`
    );

    let contentBody = formData.message;
    if (encryptEnabled && encryptedEnvelope) {
      contentBody = `--- AES-256-GCM CLIENT-ENCRYPTED ENVELOPE ---\n${JSON.stringify(encryptedEnvelope, null, 2)}\n\n(Key held strictly by sender in volatile browser memory)`;
    }

    const body = encodeURIComponent(
      `Hi Siddharth,\n\nRole/Organization: ${formData.role}\nContact Email: ${formData.email}\n\nMessage Payload:\n${contentBody}`
    );
    window.location.href = `mailto:${links.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="scroll-mt-28 py-24 sm:py-28 border-t border-white/10 bg-[#070709] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="07 // CONTACT"
          tag="Recruiter Gateway"
          title="LET'S BUILD SOMETHING AMBITIOUS TOGETHER."
          subtitle="Whether you represent Wispr Flow, an engineering team, or want to discuss multi-restaurant logistics and spatial web experiments—my inbox is open."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Links & Profile Identity (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 sm:p-8 rounded-3xl bg-[#09090e] border border-white/10 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-acid uppercase block font-bold">
                    Portfolio Owner
                  </span>
                  <h3 className="text-3xl font-display font-black text-white">
                    {PERSONAL_INFO.name}
                  </h3>
                </div>
                <button
                  onClick={onOpenConfigLinks}
                  title="Configure URLs"
                  className="p-2.5 rounded-xl bg-[#141420] border border-white/10 hover:border-acid text-[#8E8E98] hover:text-acid transition"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
                {PERSONAL_INFO.heroDescription}
              </p>

              <div className="pt-2 border-t border-white/10 space-y-2.5 font-mono text-xs">
                {/* Email Item */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#101018] border border-white/10">
                  <div className="flex items-center gap-2.5 text-white truncate mr-2">
                    <Mail className="w-4 h-4 text-acid shrink-0" />
                    <span className="truncate">{links.email}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(links.email, 'email')}
                    className="text-[#71717A] hover:text-acid shrink-0 p-1"
                    title="Copy email"
                  >
                    {copiedField === 'email' ? (
                      <Check className="w-4 h-4 text-acid" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

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
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Builder Manifesto Card */}
            <div className="p-7 rounded-3xl bg-acid/10 border border-acid/25 space-y-2 shadow-xl">
              <span className="font-mono text-[10px] text-acid uppercase tracking-widest block font-bold">
                THE BUILDER'S PLEDGE
              </span>
              <p className="font-display font-black text-xl text-white">
                "{PERSONAL_INFO.centralMessage}"
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

                  <div className="space-y-1.5">
                    <label className="text-[#A1A1AA] uppercase">Project Note / Inquiry</label>
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
                        <p className="text-[#8E8E98]">
                          Encrypt your note locally before dispatching. Keys exist strictly in your browser memory and are never sent to any server or AI model.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="password"
                            value={passphrase}
                            onChange={(e) => setPassphrase(e.target.value)}
                            placeholder="Optional passphrase (or leave empty for auto-generated 256-bit key)"
                            className="flex-1 px-3 py-2 bg-[#121220] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-acid"
                          />
                          <button
                            type="button"
                            onClick={handleEncryptMessage}
                            disabled={isEncrypting || !formData.message.trim()}
                            className="px-4 py-2 rounded-xl bg-acid text-black font-bold text-xs hover:bg-[#E5FF4D] transition disabled:opacity-50"
                          >
                            {isEncrypting ? 'Encrypting...' : 'Encrypt Note'}
                          </button>
                        </div>

                        {encryptedEnvelope && (
                          <div className="p-3 rounded-xl bg-black/70 border border-emerald-500/30 space-y-1.5">
                            <div className="flex items-center justify-between text-emerald-400">
                              <span className="font-bold flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Note Encrypted (AES-GCM-256)</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(JSON.stringify(encryptedEnvelope, null, 2), 'envelope')}
                                className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1"
                              >
                                {copiedField === 'envelope' ? <Check className="w-3.5 h-3.5 text-acid" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>Copy JSON</span>
                              </button>
                            </div>

                            <div className="text-[10px] text-[#71717A] space-y-0.5">
                              <div>IV: <span className="text-white">{encryptedEnvelope.iv}</span></div>
                              <div className="truncate">Ciphertext: <span className="text-[#A1A1AA]">{encryptedEnvelope.ciphertext}</span></div>
                            </div>

                            {rawKeyBackup && (
                              <div className="pt-1 text-[10px] text-amber-300">
                                <span>Auto-generated 256-bit Key: </span>
                                <code className="bg-black/80 px-1 py-0.5 rounded text-white">{rawKeyBackup}</code>
                                <span className="block text-[9px] text-[#71717A] mt-0.5">
                                  Save this key if you need to decrypt this note later. It is not saved in localStorage.
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
