import { ScrollControls, useScroll } from "@react-three/drei";
import { usePortalStore, useScrollStore } from "@stores";
import { useEffect } from "react";
import * as THREE from "three";
import { Memory } from "../../models/Memory";
import Timeline from "./Timeline";

function WorkScrollBridge({ active, outerScroll }: { active: boolean; outerScroll: HTMLElement }) {
  const innerScroll = useScroll();
  const setScrollProgress = useScrollStore((state) => state.setScrollProgress);

  useEffect(() => {
    const innerElement = innerScroll.el;
    const handleScroll = () => {
      const scrollHeight = innerElement.scrollHeight - innerElement.clientHeight;
      const progress = scrollHeight > 0 ? innerElement.scrollTop / scrollHeight : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };

    if (active) {
      innerElement.scrollTop = 0;
      innerElement.style.zIndex = '1';
      outerScroll.style.zIndex = '-1';
      setScrollProgress(0);
      innerElement.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      innerElement.removeEventListener('scroll', handleScroll);
      innerElement.scrollTop = 0;
      innerElement.style.zIndex = '-1';
      outerScroll.style.zIndex = '1';
      setScrollProgress(0);
    };
  }, [active, innerScroll.el, outerScroll, setScrollProgress]);

  return null;
}

const Work = () => {
  const isActive = usePortalStore((state) => (
    state.activePortalId === 'work' && state.phase !== 'exiting'
  ));
  const scrollProgress = useScrollStore((state) => state.scrollProgress);
  const outerScroll = useScroll();

  return (
    <group>
      <mesh receiveShadow>
        <planeGeometry args={[4, 4, 1]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
      <ScrollControls style={{ zIndex: -1}} pages={2} maxSpeed={0.4}>
        <WorkScrollBridge active={isActive} outerScroll={outerScroll.el} />
        <Memory scale={new THREE.Vector3(5, 5, 5)} position={new THREE.Vector3(0, -6, 1)}/>
        <Timeline progress={isActive ? scrollProgress : 0} />
      </ScrollControls>
    </group>
  );
};

export default Work;
