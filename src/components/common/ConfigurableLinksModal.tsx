import React, { useState } from 'react';
import { Modal } from './Modal';
import { SocialLinks } from '../../types';
import { Check, Copy, ExternalLink, Save } from 'lucide-react';

interface ConfigurableLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: SocialLinks;
  onSave: (updated: SocialLinks) => void;
}

export const ConfigurableLinksModal: React.FC<ConfigurableLinksModalProps> = ({
  isOpen,
  onClose,
  links,
  onSave,
}) => {
  const [form, setForm] = useState<SocialLinks>(links);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleChange = (key: keyof SocialLinks, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = (key: keyof SocialLinks) => {
    navigator.clipboard.writeText(form[key] || '');
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Profile & Contact Links"
      tag="Authentic Data Config"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <p className="text-sm text-text-muted">
          In adherence to the portfolio guidelines, no personal links or emails are fabricated.
          You can update these placeholders with Siddharth’s verified accounts or copy them.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          {(
            [
              { key: 'linkedin', label: 'LinkedIn Profile' },
              { key: 'github', label: 'GitHub Profile' },
              { key: 'instagram', label: 'Instagram Handle' },
              { key: 'email', label: 'Contact Email' },
              { key: 'portfolio', label: 'Live Portfolio Domain' },
            ] as const
          ).map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
                {label}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#14141d] border border-border-medium rounded-lg text-sm text-text-primary focus:outline-none focus:border-acid transition font-mono"
                  placeholder={`https://${key}.com/...`}
                />
                <button
                  type="button"
                  onClick={() => handleCopy(key)}
                  title="Copy link"
                  className="px-3 py-2 bg-[#1a1a24] hover:bg-[#232332] text-text-secondary hover:text-acid border border-border-medium rounded-lg transition flex items-center justify-center shrink-0"
                >
                  {copiedKey === key ? (
                    <Check className="w-4 h-4 text-acid" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-border-subtle flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono rounded-lg border border-border-medium text-text-secondary hover:bg-white/5 transition"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-mono font-semibold rounded-lg bg-acid text-black hover:bg-acid-hover transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              SAVE PROFILE LINKS
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
