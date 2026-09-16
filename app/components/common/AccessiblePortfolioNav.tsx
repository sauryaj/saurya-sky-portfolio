'use client';

import { usePortalStore, useScrollStore, type PortalId } from '@stores';
import { useEffect, useRef } from 'react';

const sections: Array<{ id: PortalId; label: string }> = [
  { id: 'work', label: 'Work and education' },
  { id: 'projects', label: 'Side projects' },
  { id: 'certificates', label: 'Certificates' },
];

export function AccessiblePortfolioNav() {
  const activePortalId = usePortalStore((state) => state.activePortalId);
  const phase = usePortalStore((state) => state.phase);
  const openPortal = usePortalStore((state) => state.openPortal);
  const experienceVisible = useScrollStore((state) => state.scrollProgress >= 0.72);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const previousPortal = useRef<PortalId | null>(null);

  useEffect(() => {
    if (previousPortal.current && !activePortalId) {
      lastTrigger.current?.focus({ preventScroll: true });
    }
    previousPortal.current = activePortalId;
  }, [activePortalId]);

  const openSection = (id: PortalId, trigger: HTMLButtonElement) => {
    lastTrigger.current = trigger;
    openPortal(id);
  };

  return (
    <>
      <div className="portfolio-introduction">
        <h1>Saurya Janbandhu — Systems Engineer</h1>
        <p>Enterprise cloud resilience, zero-trust identity, endpoint management, and security engineering.</p>
      </div>
      <nav className="portfolio-keyboard-nav" aria-label="Portfolio sections and profiles">
        <span>Explore</span>
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            disabled={phase !== 'idle' || !experienceVisible}
            aria-current={activePortalId === section.id ? 'page' : undefined}
            onClick={(event) => openSection(section.id, event.currentTarget)}
          >
            {section.label}
          </button>
        ))}
        <a href="https://www.linkedin.com/in/saurya-janbandhu-3771661b0/" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://github.com/sauryaj" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
      <p className="portfolio-status" role="status" aria-live="polite">
        {activePortalId && phase === 'active' ? `${sections.find(({ id }) => id === activePortalId)?.label} opened. Use Escape, browser Back, or the return control to close.` : ''}
      </p>
    </>
  );
}
