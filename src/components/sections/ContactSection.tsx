import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { SocialLinks } from '../../types';
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
  ArrowUpRight
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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
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
      `Wispr Flow Challenge Inquiry from ${formData.name || 'Recruiter'}`
    );
    const body = encodeURIComponent(
      `Hi Siddharth,\n\nRole/Organization: ${formData.role}\nContact Email: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${links.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-28 border-t border-white/10 bg-[#070709] relative z-10">
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
                    className="text-[#71717A] hover:text-acid shrink-0"
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
                    className="text-[#71717A] hover:text-acid shrink-0"
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
                    className="text-[#71717A] hover:text-acid shrink-0"
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
                    className="text-[#71717A] hover:text-acid shrink-0"
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

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-acid text-black font-display font-black text-xs tracking-wider hover:bg-[#E5FF4D] transition flex items-center justify-center gap-2 shadow-xl shadow-acid/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>DISPATCH DIRECT MESSAGE</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
