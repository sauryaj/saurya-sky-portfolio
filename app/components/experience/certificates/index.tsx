import { useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { usePortalStore } from '@stores';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import gsap from 'gsap';
import { CompleteShelfLandingPage } from './CompleteShelfLandingPage';
import { SAINT_JEROME_WALLPAPER } from './artwork';

function CertificateCoverArt({ active, isMobile }: { active: boolean; isMobile: boolean }) {
  const imageMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const texture = useTexture(SAINT_JEROME_WALLPAPER);
  const imageSize = isMobile ? [1.02, 1.22] as const : [2.35, 3.62] as const;
  const tileSize = isMobile ? [3, 1.25] as const : [2.6, 4] as const;

  useFrame((_, delta) => {
    if (!imageMaterial.current) return;
    imageMaterial.current.opacity = THREE.MathUtils.damp(imageMaterial.current.opacity, active ? 0.16 : 0.82, 4, delta);
  });

  return <group>
    <mesh position={[0, 0, -0.08]}>
      <planeGeometry args={tileSize} />
      <meshBasicMaterial color="#75624f" toneMapped={false} />
    </mesh>
    <mesh position={[0, 0.02, 0.02]}>
      <planeGeometry args={imageSize} />
      <meshBasicMaterial ref={imageMaterial} map={texture} transparent opacity={0.82} toneMapped={false} />
    </mesh>
    <mesh position={[0, 0.02, 0.04]}>
      <planeGeometry args={tileSize} />
      <meshBasicMaterial color="#2d2119" transparent opacity={0.2} toneMapped={false} />
    </mesh>
  </group>;
}

useTexture.preload(SAINT_JEROME_WALLPAPER);

export default function Certificates() {
  const active = usePortalStore(state => state.activePortalId === 'certificates');
  const { camera } = useThree();
  const isMobile = useThree(state => state.size.width < 1050);
  const scroll = useScroll();

  useEffect(() => {
    if (!active) return;
    const previous = scroll.el.style.overflow;
    scroll.el.style.overflow = 'hidden';
    const animation = gsap.to(camera.position, {
      x: isMobile ? 0 : 2.8,
      y: -37,
      z: isMobile ? 13 : 11.5,
      duration: 1.2,
      ease: 'power2.inOut',
    });
    const rotation = gsap.to(camera.rotation, {
      x: -Math.PI / 2,
      y: 0,
      z: 0,
      duration: 1.2,
      ease: 'power2.inOut',
    });
    return () => {
      animation.kill();
      rotation.kill();
      scroll.el.style.overflow = previous;
    };
  }, [active, camera, scroll.el, isMobile]);

  return <group>
    <color attach="background" args={["#b5aa8e"]} />
    <CertificateCoverArt active={active} isMobile={isMobile} />
  </group>;
}

export function CertificateOverlay() {
  const active = usePortalStore(state => state.activePortalId === 'certificates');
  const [mounted, setMounted] = useState(active);

  useEffect(() => {
    if (active) {
      if (mounted) return;
      const timeout = window.setTimeout(() => setMounted(true), 0);
      return () => window.clearTimeout(timeout);
    }

    if (!mounted) return;
    const timeout = window.setTimeout(() => setMounted(false), 1100);
    return () => window.clearTimeout(timeout);
  }, [active, mounted]);

  if (!mounted) return null;

  return (
    <CompleteShelfLandingPage
      isClosing={!active}
      headingFont="iowan-old-style"
      bodyFont="inter"
      headingWeight="400"
      bodyWeight="400"
      primaryColor="#c87046"
      headingSize={60}
      bodySize={12}
      headingLetterSpacing={-0.055}
    />
  );
}
