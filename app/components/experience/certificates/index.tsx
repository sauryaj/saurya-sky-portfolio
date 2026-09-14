import { useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { usePortalStore, useScrollStore } from '@stores';
import { useRef } from 'react';
import * as THREE from 'three';

import { CompleteShelfLandingPage } from './CompleteShelfLandingPage';
import { SAINT_JEROME_WALLPAPER } from './artwork';
import { PORTAL_MOTION } from '../portalMotion';

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
  const active = usePortalStore(state => (
    state.activePortalId === 'certificates' && state.phase !== 'exiting'
  ));
  const isMobile = useThree(state => state.size.width < 1050);

  return <group>
    <color attach="background" args={["#b5aa8e"]} />
    <CertificateCoverArt active={active} isMobile={isMobile} />
  </group>;
}

export function CertificateOverlay() {
  const activePortalId = usePortalStore(state => state.activePortalId);
  const portalPhase = usePortalStore(state => state.phase);
  const nearExperience = useScrollStore(state => state.scrollProgress > 0.55);
  const closePortal = usePortalStore(state => state.closePortal);
  const shouldPrepare = nearExperience || activePortalId === 'certificates';

  if (!shouldPrepare) return null;

  const state = activePortalId === 'certificates' ? portalPhase : 'idle';
  const motion = PORTAL_MOTION.certificates;

  return (
    <CompleteShelfLandingPage
      state={state}
      enterDurationMs={motion.enter * 1000}
      exitDurationMs={motion.exit * 1000}
      headingFont="iowan-old-style"
      bodyFont="inter"
      headingWeight="400"
      bodyWeight="400"
      primaryColor="#c87046"
      headingSize={60}
      bodySize={12}
      headingLetterSpacing={-0.055}
      onRequestClose={closePortal}
    />
  );
}
