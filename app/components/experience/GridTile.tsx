
import { Edges, MeshPortalMaterial, Text, TextProps } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { usePortalStore } from '@stores';
import gsap from "gsap";
import { useRef } from 'react';
import { isMobile } from 'react-device-detect';
import * as THREE from 'three';


interface GridTileProps {
  id: string;
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
  const { camera } = useThree();
  const setActivePortal = usePortalStore((state) => state.setActivePortal);
  const isActive = usePortalStore((state) => state.activePortalId === id);
  const activePortalId = usePortalStore((state) => state.activePortalId);

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      exitPortal(true);
    }
  };

  const portalInto = (e: React.MouseEvent) => {
    if (isActive || activePortalId) return;
    e.stopPropagation();
    const portalDuration = id === 'certificates' ? 1.15 : 0.85;
    setActivePortal(id);
    document.body.style.cursor = 'auto';
    const div = document.createElement('button');

    div.className = `fixed close${id === 'certificates' ? ' close-certificates' : ''}`;
    div.setAttribute('aria-label', 'Return to experience');
    div.style.transform = 'rotateX(90deg)';
    div.onclick = () => exitPortal(true);

    if (!document.querySelector('.close')) {
      document.body.appendChild(div);

      gsap.fromTo(div, {
        scale: 0,
        rotate: '-180deg',
      },{
        opacity: 1,
        zIndex: 10,
        transform: 'rotateX(0deg)',
        scale: 1,
        duration: portalDuration,
      })
    }
    document.body.addEventListener('keydown', handleEscape);
    gsap.to(portalRef.current, {
      blend: 1,
      duration: portalDuration,
      ease: 'power2.inOut',
    });
  };

  const exitPortal = (force = false) => {
    if (!force && !activePortalId) return;
    const portalDuration = id === 'certificates' ? 1.15 : 1.1;
    setActivePortal(null)

    gsap.to(camera.position, {
      x: 0,
      duration: portalDuration,
      ease: 'power2.inOut',
    });

    gsap.to(camera.rotation, {
      x: -Math.PI / 2,
      y: 0,
      duration: portalDuration,
      ease: 'power2.inOut',
    });

    gsap.to(portalRef.current, {
      blend: 0,
      duration: portalDuration,
      ease: 'power2.inOut',
    });

    // Remove the return control from the DOM after the portal closes.
    const closeButton = document.querySelector('.close');
    if (!closeButton) {
      document.body.removeEventListener('keydown', handleEscape);
      return;
    }
    gsap.to(closeButton, {
      scale: 0,
      duration: 0.5,
      onComplete: () => {
        document.querySelectorAll('.close').forEach((el) => {
          el.remove();
        });
      }
    })
    document.body.removeEventListener('keydown', handleEscape);
  }

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
