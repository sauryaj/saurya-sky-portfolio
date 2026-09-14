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
      background-attachment: fixed !important;
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
    const readyFallback = window.setTimeout(() => setReady(true), 1500);
    return () => {
      window.removeEventListener('message', receiveFrameMessage);
      window.clearTimeout(readyFallback);
    };
  }, []);

  useEffect(() => {
    const type = state === 'idle'
      ? 'certificate-archive:pause'
      : 'certificate-archive:resume';

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
      style={frameStyle}
    >
      <iframe
        ref={iframeRef}
        title="Certificate Archive — Five Verified Credentials"
        src="/landing-pages/certificate-shelf.html"
        loading="eager"
        sandbox="allow-downloads allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
        onLoad={(event) => {
          applySaintJeromeWallpaper(event.currentTarget);
          setReady(true);
        }}
      />
    </div>
  );
}
