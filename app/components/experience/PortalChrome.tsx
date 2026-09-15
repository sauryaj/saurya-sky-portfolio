'use client';

import { usePortalStore, useScrollStore } from '@stores';
import { useCallback, useEffect, useRef } from 'react';

export function PortalChrome() {
  const activePortalId = usePortalStore((state) => state.activePortalId);
  const phase = usePortalStore((state) => state.phase);
  const closePortal = usePortalStore((state) => state.closePortal);
  const closeRef = useRef<HTMLButtonElement>(null);
  const upwardTravel = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const historyEntryActive = useRef(false);

  const clearReturnProgress = useCallback(() => {
    upwardTravel.current = 0;
    document.body.classList.remove('portal-returning');
    document.documentElement.style.removeProperty('--portal-return-scale');
    document.documentElement.style.removeProperty('--portal-return-y');
    document.documentElement.style.removeProperty('--portal-return-progress');
  }, []);

  const showReturnProgress = useCallback((travel: number) => {
    const progress = Math.min(travel / 120, 1);
    document.body.classList.add('portal-returning');
    document.documentElement.style.setProperty('--portal-return-scale', String(1 - progress * 0.025));
    document.documentElement.style.setProperty('--portal-return-y', `${progress * 12}px`);
    document.documentElement.style.setProperty('--portal-return-progress', String(progress));
  }, []);

  useEffect(() => {
    if (!activePortalId) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePortal();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activePortalId, closePortal]);

  useEffect(() => {
    if (!activePortalId || phase !== 'entering' || historyEntryActive.current) return;
    window.history.pushState({ portfolioPortal: activePortalId }, '', window.location.href);
    historyEntryActive.current = true;
  }, [activePortalId, phase]);

  useEffect(() => {
    const handlePopState = () => {
      if (!historyEntryActive.current) return;
      historyEntryActive.current = false;
      clearReturnProgress();
      closePortal();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [clearReturnProgress, closePortal]);

  useEffect(() => {
    if (phase !== 'exiting' || !historyEntryActive.current) return;
    historyEntryActive.current = false;
    window.history.back();
  }, [phase]);

  useEffect(() => {
    if (!activePortalId || phase !== 'active') {
      upwardTravel.current = 0;
      return;
    }

    const canReturn = () => activePortalId === 'projects'
      || (activePortalId === 'work' && useScrollStore.getState().scrollProgress <= 0.02);

    const commitReturn = () => {
      clearReturnProgress();
      closePortal();
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY >= 0) {
        clearReturnProgress();
        return;
      }

      if (!canReturn()) return;

      upwardTravel.current += Math.abs(event.deltaY);
      showReturnProgress(upwardTravel.current);
      if (upwardTravel.current >= 120) {
        commitReturn();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (!canReturn()) return;
      touchStartY.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartY.current === null || !canReturn()) return;
      const travel = Math.max(0, (event.touches[0]?.clientY ?? touchStartY.current) - touchStartY.current);
      upwardTravel.current = travel;
      showReturnProgress(travel);
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
      if (upwardTravel.current >= 90) commitReturn();
      else clearReturnProgress();
    };

    const handleFrameMessage = (event: MessageEvent) => {
      if (
        activePortalId === 'certificates'
        && event.origin === window.location.origin
        && event.data?.type === 'certificate-archive:request-close'
      ) {
        commitReturn();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true, capture: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });
    window.addEventListener('message', handleFrameMessage);
    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('touchstart', handleTouchStart, { capture: true });
      window.removeEventListener('touchmove', handleTouchMove, { capture: true });
      window.removeEventListener('touchend', handleTouchEnd, { capture: true });
      window.removeEventListener('message', handleFrameMessage);
      touchStartY.current = null;
      clearReturnProgress();
    };
  }, [activePortalId, clearReturnProgress, closePortal, phase, showReturnProgress]);

  useEffect(() => {
    if (phase === 'active') closeRef.current?.focus({ preventScroll: true });
  }, [phase]);

  if (!activePortalId) return null;

  return <>
    <button
      ref={closeRef}
      type="button"
      className={`close portal-close${activePortalId === 'certificates' ? ' close-certificates' : ''}`}
      data-phase={phase}
      aria-label="Return to experience"
      onClick={closePortal}
    />
    <div
      className={`portal-return-hint${activePortalId === 'certificates' ? ' portal-return-hint-light' : ''}`}
      data-visible={phase === 'active'}
      aria-hidden={phase !== 'active'}
    >
      <span aria-hidden="true">↑</span>
      <span>Scroll up or swipe down to return</span>
    </div>
  </>;
}
