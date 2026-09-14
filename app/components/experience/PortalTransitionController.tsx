'use client';

import { useScroll } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { usePortalStore } from '@stores';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { getPortalDuration, PORTAL_MOTION } from './portalMotion';

type CameraPose = {
  position: THREE.Vector3;
  rotation: THREE.Euler;
};

export function PortalTransitionController() {
  const activePortalId = usePortalStore((state) => state.activePortalId);
  const phase = usePortalStore((state) => state.phase);
  const completeOpening = usePortalStore((state) => state.completeOpening);
  const completeClosing = usePortalStore((state) => state.completeClosing);
  const camera = useThree((state) => state.camera);
  const viewportWidth = useThree((state) => state.size.width);
  const scroll = useScroll();
  const returnPose = useRef<CameraPose | null>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const scrollElement = scroll.el;
    const previousOverflow = scrollElement.style.overflow;
    scrollElement.style.overflow = phase === 'idle' ? previousOverflow : 'hidden';

    return () => {
      scrollElement.style.overflow = previousOverflow;
    };
  }, [phase, scroll.el]);

  useEffect(() => {
    if (!activePortalId || (phase !== 'entering' && phase !== 'exiting')) return;

    timeline.current?.kill();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reducedMotion ? 0.01 : getPortalDuration(activePortalId, phase === 'entering' ? 'enter' : 'exit');
    const ease = activePortalId === 'certificates' ? 'power3.inOut' : 'power2.inOut';

    if (phase === 'entering') {
      returnPose.current = {
        position: camera.position.clone(),
        rotation: camera.rotation.clone(),
      };
      const target = viewportWidth < 1050
        ? PORTAL_MOTION[activePortalId].camera.mobile
        : PORTAL_MOTION[activePortalId].camera.desktop;

      timeline.current = gsap.timeline({
        onComplete: () => {
          completeOpening(activePortalId);
        },
      });
      timeline.current
        .to(camera.position, { x: target[0], y: target[1], z: target[2], duration, ease }, 0)
        .to(camera.rotation, { x: -Math.PI / 2, y: 0, z: 0, duration, ease }, 0);
    } else {
      const target = returnPose.current;
      timeline.current = gsap.timeline({
        onComplete: () => {
          completeClosing(activePortalId);
          returnPose.current = null;
        },
      });
      if (target) {
        timeline.current
          .to(camera.position, {
            x: target.position.x,
            y: target.position.y,
            z: target.position.z,
            duration,
            ease,
          }, 0)
          .to(camera.rotation, {
            x: target.rotation.x,
            y: target.rotation.y,
            z: target.rotation.z,
            duration,
            ease,
          }, 0);
      } else {
        timeline.current.call(() => completeClosing(activePortalId));
      }
    }

    return () => {
      timeline.current?.kill();
    };
  }, [
    activePortalId,
    camera,
    completeClosing,
    completeOpening,
    phase,
    viewportWidth,
  ]);

  useEffect(() => () => {
    timeline.current?.kill();
  }, []);

  return null;
}
