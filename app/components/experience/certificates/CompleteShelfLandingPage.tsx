'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

import styles from './completeShelf.module.css';
import { SAINT_JEROME_WALLPAPER } from './artwork';

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
 * renderer, camera choreography, and responsive behavior byte-for-byte.
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

  useEffect(() => {
    const receiveFrameMessage = (event: MessageEvent) => {
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
    >
      <iframe
        ref={iframeRef}
        title="Certificate Archive — Five Verified Credentials"
        src="/landing-pages/certificate-shelf.html"
        loading="eager"
        sandbox="allow-same-origin allow-scripts"
        aria-hidden={state !== 'active'}
        inert={state !== 'active'}
        tabIndex={state === 'active' ? 0 : -1}
        onLoad={(event) => {
          applySaintJeromeWallpaper(event.currentTarget);
        }}
      />
    </div>
  );
}
