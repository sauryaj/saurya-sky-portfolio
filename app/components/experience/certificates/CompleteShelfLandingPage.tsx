'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';

import styles from './completeShelf.module.css';
import { SAINT_JEROME_WALLPAPER } from './artwork';
import CredentialShelf from './CredentialShelf';

const subscribeScreen = (callback: () => void) => {
  const query = window.matchMedia('(max-width: 819px)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};

function applySaintJeromeWallpaper(frame: HTMLIFrameElement) {
  const document = frame.contentDocument;
  if (!document) return;

  document.getElementById('sky-portfolio-saint-jerome')?.remove();
  const style = document.createElement('style');
  style.id = 'sky-portfolio-saint-jerome';
  style.textContent = `
    .experience {
      background-color: #403125 !important;
      background-image: linear-gradient(rgba(30, 22, 18, 0.54), rgba(30, 22, 18, 0.54)), url("${SAINT_JEROME_WALLPAPER}") !important;
      background-size: cover !important;
      background-position: center center !important;
    }
    .experience::before {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: url("${SAINT_JEROME_WALLPAPER}") center / cover no-repeat;
      content: "";
      opacity: 0.22;
      mix-blend-mode: screen;
      pointer-events: none;
    }
    #scene {
      opacity: 0.84 !important;
    }
  `;
  document.head.appendChild(style);
}

export type CompleteShelfLandingPageProps = {
  className?: string;
  style?: CSSProperties;
  headingFont?: string;
  bodyFont?: string;
  headingWeight?: string;
  bodyWeight?: string;
  primaryColor?: string;
  headingSize?: number;
  bodySize?: number;
  headingLetterSpacing?: number;
  state?: 'idle' | 'entering' | 'active' | 'exiting';
  enterDurationMs?: number;
  exitDurationMs?: number;
  onRequestClose?: () => void;
};

type ShelfFrameStyle = CSSProperties & {
  '--certificate-wallpaper': string;
  '--certificate-enter-duration': string;
  '--certificate-exit-duration': string;
};

/**
 * The registered ThreeUI component is a complete authored HTML/Three.js
 * document. Keeping it in its own frame preserves its DOM, CSS, import map,
 * renderer and camera choreography, with a native catalog while it loads.
 */
export function CompleteShelfLandingPage({
  className = '',
  style,
  headingFont = 'iowan-old-style',
  bodyFont = 'inter',
  headingWeight = '400',
  bodyWeight = '400',
  primaryColor = '#c87046',
  headingSize = 60,
  bodySize = 12,
  headingLetterSpacing = -0.055,
  state = 'active',
  enterDurationMs = 1050,
  exitDurationMs = 1050,
  onRequestClose,
}: CompleteShelfLandingPageProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const compact = useSyncExternalStore(subscribeScreen, () => window.matchMedia('(max-width: 819px)').matches, () => true);
  const [requested3D, setRequested3D] = useState(false);
  const [failed, setFailed] = useState(false);
  const lightweight = (compact && !requested3D) || failed;

  useEffect(() => {
    if (lightweight || ready) return;
    const timeout = window.setTimeout(() => setFailed(true), 8000);
    return () => window.clearTimeout(timeout);
  }, [lightweight, ready]);

  useEffect(() => {
    const receiveFrameMessage = (event: MessageEvent) => {
      if (event.source === iframeRef.current?.contentWindow && event.data?.type === 'certificate-archive:fallback') {
        setFailed(true);
        return;
      }
      if (
        event.source === iframeRef.current?.contentWindow &&
        event.data?.type === 'certificate-archive:ready'
      ) {
        setReady(true);
      }
    };

    window.addEventListener('message', receiveFrameMessage);
    return () => window.removeEventListener('message', receiveFrameMessage);
  }, []);

  useEffect(() => {
    const frameWindow = iframeRef.current?.contentWindow;
    const frameDocument = iframeRef.current?.contentDocument;
    if (!ready || !frameWindow || !frameDocument || !onRequestClose) return;

    const handleFrameEscape = (event: KeyboardEvent) => {
      const detailIsOpen = frameDocument
        .querySelector('.experience')
        ?.classList.contains('mode-detail');
      if (event.key === 'Escape' && !detailIsOpen) onRequestClose();
    };

    frameWindow.addEventListener('keydown', handleFrameEscape);
    return () => frameWindow.removeEventListener('keydown', handleFrameEscape);
  }, [onRequestClose, ready]);

  useEffect(() => {
    const type = state === 'idle'
      ? 'certificate-archive:pause'
      : 'certificate-archive:resume';

    if (state !== 'active') {
      const focusedFrameElement = iframeRef.current?.contentDocument?.activeElement;
      if (focusedFrameElement && 'blur' in focusedFrameElement) {
        (focusedFrameElement as HTMLElement).blur();
      }
      iframeRef.current?.blur();
    }

    if (state !== 'idle') {
      iframeRef.current?.contentWindow?.postMessage({ type }, '*');
      return;
    }

    const timeout = window.setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage({ type }, '*');
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [ready, state]);

  const frameStyle: ShelfFrameStyle = {
    ...style,
    '--certificate-wallpaper': `url("${SAINT_JEROME_WALLPAPER}")`,
    '--certificate-enter-duration': `${enterDurationMs}ms`,
    '--certificate-exit-duration': `${exitDurationMs}ms`,
  };

  return (
    <div
      className={`${styles.frame} ${styles[state]}${ready ? ` ${styles.ready}` : ''}${className ? ` ${className}` : ''}`}
      data-heading-font={headingFont}
      data-body-font={bodyFont}
      data-heading-weight={headingWeight}
      data-body-weight={bodyWeight}
      data-primary-color={primaryColor}
      data-heading-size={headingSize}
      data-body-size={bodySize}
      data-heading-letter-spacing={headingLetterSpacing}
      aria-hidden={state !== 'active'}
      inert={state !== 'active'}
      style={frameStyle}
      data-archive-status={lightweight ? 'catalog' : ready ? 'ready' : 'loading'}
    >
      {(lightweight || !ready) && <CredentialShelf onOpen3D={lightweight ? () => {
        setFailed(false);
        setReady(false);
        setRequested3D(true);
      } : undefined} />}
      {!lightweight && <iframe
        ref={iframeRef}
        title="Certificate Archive — Five Verified Credentials"
        src="/landing-pages/certificate-shelf.html"
        loading="eager"
        sandbox="allow-same-origin allow-scripts"
        aria-hidden={state !== 'active' || !ready}
        inert={state !== 'active' || !ready}
        tabIndex={state === 'active' && ready ? 0 : -1}
        onLoad={(event) => {
          const frame = event.currentTarget;
          try {
            const experience = frame.contentDocument?.querySelector('#experience');
            if (!experience) {
              setFailed(true);
              return;
            }
            applySaintJeromeWallpaper(frame);
            // Recover if the ready message arrived before the listener was attached.
            setReady(experience.classList.contains('webgl-ready'));
          } catch {
            setFailed(true);
          }
        }}
        onError={() => setFailed(true)}
      />}
    </div>
  );
}
