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
    role: 'Recruiter / Hiring Team',
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
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#D4FF00', '#ffffff', '#8AA600'],
    });

    setSubmitted(true);
    // Open mailto link
    const subject = encodeURIComponent(
      `Wispr Flow Challenge Inquiry from ${formData.name || 'Recruiter'}`
    );
    const body = encodeURIComponent(
      `Hi Siddharth,\n\nRole/Organization: ${formData.role}\nContact Email: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${links.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-24 border-t border-[#181826] bg-[#08080a] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="07 // CONTACT"
          tag="Recruiter Gateway"
          title="LET'S BUILD SOMETHING AMBITIOUS TOGETHER."
          subtitle="Whether you represent Wispr Flow, an engineering team, or want to discuss multi-restaurant logistics and spatial web experiments—my inbox is open."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Links & Profile Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0c0c14] border border-[#232332] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-acid uppercase block">
                    Portfolio Owner
                  </span>
                  <h3 className="text-2xl font-display font-extrabold text-text-primary">
                    {PERSONAL_INFO.name}
                  </h3>
                </div>
                <button
                  onClick={onOpenConfigLinks}
                  title="Configure URLs"
                  className="p-2 rounded-lg bg-[#161622] border border-border-subtle hover:border-acid text-text-secondary hover:text-acid transition"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                {PERSONAL_INFO.heroDescription}
              </p>

              <div className="pt-2 border-t border-border-subtle space-y-2.5 font-mono text-xs">
                {/* Email Item */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#111119] border border-border-subtle">
                  <div className="flex items-center gap-2 text-text-primary truncate mr-2">
                    <Mail className="w-4 h-4 text-acid shrink-0" />
                    <span className="truncate">{links.email}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(links.email, 'email')}
                    className="text-text-muted hover:text-acid shrink-0"
                    title="Copy email"
                  >
                    {copiedField === 'email' ? (
                      <Check className="w-3.5 h-3.5 text-acid" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* LinkedIn Item */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#111119] border border-border-subtle">
                  <div className="flex items-center gap-2 text-text-primary truncate mr-2">
                    <Linkedin className="w-4 h-4 text-acid shrink-0" />
                    <span className="truncate">{links.linkedin}</span>
                  </div>
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-text-muted hover:text-acid shrink-0"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* GitHub Item */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#111119] border border-border-subtle">
                  <div className="flex items-center gap-2 text-text-primary truncate mr-2">
                    <Github className="w-4 h-4 text-acid shrink-0" />
                    <span className="truncate">{links.github}</span>
                  </div>
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-text-muted hover:text-acid shrink-0"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Instagram Item */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#111119] border border-border-subtle">
                  <div className="flex items-center gap-2 text-text-primary truncate mr-2">
                    <Instagram className="w-4 h-4 text-acid shrink-0" />
                    <span className="truncate">{links.instagram}</span>
                  </div>
                  <a
                    href={links.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-text-muted hover:text-acid shrink-0"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quote Card */}
            <div className="p-6 rounded-3xl bg-acid/5 border border-acid/20 space-y-2">
              <span className="font-mono text-[10px] text-acid uppercase tracking-widest block font-bold">
                THE BUILDER'S PLEDGE
              </span>
              <p className="font-display font-bold text-lg text-text-primary">
                "{PERSONAL_INFO.centralMessage}"
              </p>
              <p className="text-xs text-text-secondary font-sans leading-relaxed">
                {PERSONAL_INFO.supportingMessage}
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Dispatch Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0c14] border border-[#242436] shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1c1c28]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-acid animate-ping" />
                  <h3 className="font-display font-bold text-lg text-text-primary">
                    Recruiter Direct Dispatch
                  </h3>
                </div>
                <span className="font-mono text-xs text-text-muted">
                  Dispatches via Default Mail Client
                </span>
              </div>

              {submitted ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-acid/20 border border-acid text-acid flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-text-primary">
                    Message Dispatched!
                  </h4>
                  <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto font-sans">
                    Your mail client has been opened with the structured message. Siddharth typically responds within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 text-xs font-mono rounded-lg bg-[#181824] text-acid border border-acid/30 hover:bg-acid hover:text-black transition"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-text-secondary uppercase">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Mercer"
                        className="w-full px-3.5 py-2.5 bg-[#12121b] border border-border-medium rounded-xl text-text-primary focus:outline-none focus:border-acid transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-text-secondary uppercase">Your Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full px-3.5 py-2.5 bg-[#12121b] border border-border-medium rounded-xl text-text-primary focus:outline-none focus:border-acid transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-text-secondary uppercase">Your Role / Organization</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#12121b] border border-border-medium rounded-xl text-text-primary focus:outline-none focus:border-acid transition"
                    >
                      <option value="Wispr Flow Team">Wispr Flow Team / Hiring Evaluator</option>
                      <option value="Product / Engineering Recruiter">Product / Engineering Recruiter</option>
                      <option value="Startup Founder / Co-builder">Startup Founder / Co-builder</option>
                      <option value="Other Inquirer">Other General Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-text-secondary uppercase">Project Note / Inquiry</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Siddharth, reviewed your VOICEPRINT portfolio for the Wispr Flow challenge. Let's schedule a call to discuss your projects..."
                      className="w-full px-3.5 py-2.5 bg-[#12121b] border border-border-medium rounded-xl text-text-primary focus:outline-none focus:border-acid transition leading-relaxed font-sans text-xs sm:text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-acid text-black font-display font-bold text-xs tracking-wider hover:bg-acid-hover transition flex items-center justify-center gap-2 shadow-lg shadow-acid/15"
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
