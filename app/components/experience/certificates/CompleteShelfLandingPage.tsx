'use client';

import type { CSSProperties } from 'react';

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
  isClosing?: boolean;
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
  isClosing = false,
}: CompleteShelfLandingPageProps) {
  return (
    <div
      className={`${styles.frame}${isClosing ? ` ${styles.closing}` : ''}${className ? ` ${className}` : ''}`}
      data-heading-font={headingFont}
      data-body-font={bodyFont}
      data-heading-weight={headingWeight}
      data-body-weight={bodyWeight}
      data-primary-color={primaryColor}
      data-heading-size={headingSize}
      data-body-size={bodySize}
      data-heading-letter-spacing={headingLetterSpacing}
      style={style}
    >
      <iframe
        title="Certificate Archive — Five Verified Credentials"
        src="/landing-pages/certificate-shelf.html"
        loading="eager"
        sandbox="allow-downloads allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
        onLoad={(event) => applySaintJeromeWallpaper(event.currentTarget)}
      />
    </div>
  );
}
