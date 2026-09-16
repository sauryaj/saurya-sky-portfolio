import gsap from "gsap";
import Image from "next/image";
import { useEffect } from "react";

import { usePortalStore, useScrollStore, useThemeStore } from "@stores";

export const ScrollHint = () => {
  const portal = usePortalStore((state) => state.activePortalId);
  const atScrollStart = useScrollStore((state) => state.scrollProgress === 0);
  const darkTheme = useThemeStore((state) => state.theme.type === 'dark');

  // Show 'Scroll' for Hero and work portals, 'Pan' for Projects portal.
  let hintText = '';
  let showScrollHint = false;
  if (!portal) {
    hintText = 'SCROLL';
    showScrollHint = atScrollStart;
  } else if (portal === 'work') {
    hintText = 'SCROLL';
    showScrollHint = atScrollStart;
  } else if (portal === 'projects') {
    hintText = 'PAN';
    showScrollHint = true;
  }

  useEffect(() => {
    if (showScrollHint) {
      gsap.to('.scroll-hint', {
        opacity: 1,
        duration: 1.5,
        delay: 1.5,
      });
    } else {
      gsap.killTweensOf('.scroll-hint');
      gsap.to('.scroll-hint', {
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [showScrollHint]);

  const svgSrc = hintText === 'PAN' ? 'icons/chevrons-left-right.svg' : 'icons/chevrons-up-down.svg';

  return (
    <div className="fixed w-full bottom-5 scroll-hint" style={{ opacity: 0 }}>
      <div className="flex items-center justify-center scroll-hint-content">
        <Image
          src={svgSrc}
          width={18}
          height={18}
          alt=""
          loading="lazy"
          style={{ filter: darkTheme ? 'none' : 'brightness(0)', opacity: 0.82 }}
        />
        <span style={{ color: darkTheme ? '#fff' : '#07131c' }}>{hintText}</span>
      </div>
    </div>
  );
}
