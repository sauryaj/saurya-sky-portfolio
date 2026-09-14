'use client';

import { usePortalStore } from '@stores';
import { useEffect, useRef } from 'react';

export function PortalChrome() {
  const activePortalId = usePortalStore((state) => state.activePortalId);
  const phase = usePortalStore((state) => state.phase);
  const closePortal = usePortalStore((state) => state.closePortal);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!activePortalId) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePortal();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activePortalId, closePortal]);

  useEffect(() => {
    if (phase === 'active') closeRef.current?.focus({ preventScroll: true });
  }, [phase]);

  if (!activePortalId) return null;

  return (
    <button
      ref={closeRef}
      type="button"
      className={`close portal-close${activePortalId === 'certificates' ? ' close-certificates' : ''}`}
      data-phase={phase}
      aria-label="Return to experience"
      onClick={closePortal}
    />
  );
}
