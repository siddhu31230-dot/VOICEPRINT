import React from 'react';

interface SectionHeadingProps {
  number: string;
  tag: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  number,
  tag,
  title,
  subtitle,
  align = 'left',
}) => {
  const isCentered = align === 'center';

  return (
    <div className={`mb-12 md:mb-16 ${isCentered ? 'text-center max-w-3xl mx-auto' : 'max-w-4xl'}`}>
      <div className={`flex items-center gap-3 mb-3 ${isCentered ? 'justify-center' : ''}`}>
        <span className="font-mono text-xs uppercase tracking-widest text-acid px-2 py-0.5 rounded bg-acid/10 border border-acid/20">
          {number}
        </span>
        <span className="h-px w-6 bg-border-medium" />
        <span className="font-mono text-xs tracking-wider text-text-secondary uppercase">
          {tag}
        </span>
      </div>

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-text-primary leading-[1.15]">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed font-sans max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};
