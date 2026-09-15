'use client';

import { usePortalStore, useScrollStore } from '@stores';
import { useEffect, useRef } from 'react';

export function PortalChrome() {
  const activePortalId = usePortalStore((state) => state.activePortalId);
  const phase = usePortalStore((state) => state.phase);
  const closePortal = usePortalStore((state) => state.closePortal);
  const closeRef = useRef<HTMLButtonElement>(null);
  const upwardTravel = useRef(0);

  useEffect(() => {
    if (!activePortalId) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePortal();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activePortalId, closePortal]);

  useEffect(() => {
    if (!activePortalId || phase !== 'active') {
      upwardTravel.current = 0;
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY >= 0) {
        upwardTravel.current = 0;
        return;
      }

      const canReturn = activePortalId === 'projects'
        || (activePortalId === 'work' && useScrollStore.getState().scrollProgress <= 0.02);
      if (!canReturn) return;

      upwardTravel.current += Math.abs(event.deltaY);
      if (upwardTravel.current >= 120) {
        upwardTravel.current = 0;
        closePortal();
      }
    };

    const handleFrameMessage = (event: MessageEvent) => {
      if (
        activePortalId === 'certificates'
        && event.origin === window.location.origin
        && event.data?.type === 'certificate-archive:request-close'
      ) {
        closePortal();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true, capture: true });
    window.addEventListener('message', handleFrameMessage);
    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('message', handleFrameMessage);
      upwardTravel.current = 0;
    };
  }, [activePortalId, closePortal, phase]);

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
