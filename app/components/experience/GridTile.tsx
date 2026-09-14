
import { Edges, MeshPortalMaterial, Text, TextProps } from '@react-three/drei';
import { usePortalStore, type PortalId } from '@stores';
import gsap from "gsap";
import { useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import * as THREE from 'three';

import { getPortalDuration } from './portalMotion';


interface GridTileProps {
  id: PortalId;
  title: string;
  textAlign: TextProps['textAlign'];
  children: React.ReactNode;
  color: string;
  position: THREE.Vector3;
  size?: [number, number];
}

// TODO: Rename this
const GridTile = (props: GridTileProps) => {
  const titleRef = useRef<THREE.Group>(null);
  const gridRef = useRef<THREE.Group>(null);
  const hoverBoxRef = useRef<THREE.Mesh>(null);
  const portalRef = useRef(null);
  const { title, textAlign, children, color, position, id, size = [4, 4] } = props;
  const openPortal = usePortalStore((state) => state.openPortal);
  const isActive = usePortalStore((state) => state.activePortalId === id);
  const activePortalId = usePortalStore((state) => state.activePortalId);
  const phase = usePortalStore((state) => state.phase);
  const opening = isActive && phase !== 'exiting';

  useEffect(() => {
    const direction = opening ? 'enter' : 'exit';
    const animation = gsap.to(portalRef.current, {
      blend: opening ? 1 : 0,
      duration: getPortalDuration(id, direction),
      ease: id === 'certificates' ? 'power3.inOut' : 'power2.inOut',
    });

    return () => {
      animation.kill();
    };
  }, [id, opening]);

  const portalInto = (e: React.MouseEvent) => {
    if (isActive || activePortalId) return;
    e.stopPropagation();
    openPortal(id);
    document.body.style.cursor = 'auto';
  };

  const fontProps: Partial<TextProps> = {
    font: "./soria-font.ttf",
    maxWidth: size[0] - 0.3,
    anchorX: 'center',
    anchorY: 'bottom',
    fontSize: size[1] < 2 ? 0.2 : 0.3,
    color: 'white',
    textAlign: textAlign,
    fillOpacity: 1,
  };

  const onPointerOver = () => {
    if (isActive || isMobile) return;
    document.body.style.cursor = 'pointer';
    gsap.to(titleRef.current, {
      fillOpacity: 1
    });
    if (gridRef.current && hoverBoxRef.current) {
      gsap.to(gridRef.current.position, { z: 0.5, duration: 0.4});
      gsap.to(hoverBoxRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.4 });
    }
  };

  const onPointerOut = () => {
    if (isMobile) return;
    document.body.style.cursor = 'auto';
    gsap.to(titleRef.current, {
      fillOpacity: 1
    });
    if (gridRef.current && hoverBoxRef.current) {
      gsap.to(gridRef.current.position, { z: 0, duration: 0.4});
      gsap.to(hoverBoxRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.4 });
    }
  };

  return (
    <mesh ref={gridRef}
      position={position}
      onClick={portalInto}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}>
      <planeGeometry args={size} />
      <group>
        <mesh position={[0, -size[1] / 2 + 0.28, 0.2]}>
          <planeGeometry args={[size[0], 0.56]} />
          <meshBasicMaterial color="#10202d" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 0, -0.01]} ref={hoverBoxRef} scale={[0, 0, 0]}>
          <boxGeometry args={[...size, 0.5]}/>
          <meshPhysicalMaterial
            color="#444"
            transparent={true}
            opacity={0.3}
          />
          <Edges color="white" lineWidth={3}/>
        </mesh>
        <Text position={[0, -size[1] / 2 + 0.12, 0.4]} {...fontProps} ref={titleRef}>
          {title}
        </Text>
      </group>
      <MeshPortalMaterial ref={portalRef} blend={0} resolution={0} blur={0}>
        <color attach="background" args={[color]} />
        {children}
      </MeshPortalMaterial>
    </mesh>
  );
}

export default GridTile;
