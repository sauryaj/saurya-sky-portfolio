import { Edges, Html, Text, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { Certification } from "../../../types";
import { CERTIFICATIONS } from "../../../constants";
import { usePortalStore } from "@stores";

const DESKTOP_POSITIONS: [number, number, number][] = [
  [-2.15, 0.95, 0.4],
  [0.35, 1.2, -0.15],
  [-1.05, -1.15, -0.65],
  [1.75, -0.95, -1],
];

const MOBILE_POSITIONS: [number, number, number][] = [
  [0, 1.45, 0.2],
  [0, 0.45, 0],
  [0, -0.55, -0.2],
  [0, -1.55, -0.4],
];

const ArchiveFrame = ({ certification, index, selected, hovered, onSelect, onHover }: {
  certification: Certification;
  index: number;
  selected: boolean;
  hovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) => {
  const frameRef = useRef<THREE.Group>(null);
  const position = (isMobile ? MOBILE_POSITIONS : DESKTOP_POSITIONS)[index];
  const baseScale = isMobile ? 0.7 : 1;

  useFrame(({ clock }, delta) => {
    if (!frameRef.current) return;
    const targetScale = baseScale * (selected ? 1.08 : hovered ? 1.03 : 1);
    const scale = THREE.MathUtils.damp(frameRef.current.scale.x, targetScale, 7, delta);
    frameRef.current.scale.setScalar(scale);
    frameRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.7 + index) * 0.045;
    frameRef.current.rotation.z = THREE.MathUtils.damp(
      frameRef.current.rotation.z,
      hovered || selected ? 0 : index % 2 === 0 ? 0.018 : -0.018,
      5,
      delta,
    );
  });

  return (
    <group ref={frameRef} position={position}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(certification.id);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(certification.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "auto";
        }}
      >
        <planeGeometry args={[2.45, 1.55]} />
        <meshBasicMaterial color="#edf1ef" transparent opacity={0.96} />
        <Edges color={certification.accent} lineWidth={selected ? 2.5 : 1.25} />
      </mesh>
      <Text position={[-1.02, 0.53, 0.04]} anchorX="left" anchorY="middle" font="./Vercetti-Regular.woff" fontSize={0.105} letterSpacing={0.08} color={certification.accent}>
        {certification.category}
      </Text>
      <Text position={[-1.02, 0.17, 0.04]} anchorX="left" anchorY="middle" font="./soria-font.ttf" fontSize={0.2} maxWidth={2.05} color="#18222b">
        {certification.title}
      </Text>
      <Text position={[-1.02, -0.35, 0.04]} anchorX="left" anchorY="middle" font="./Vercetti-Regular.woff" fontSize={0.11} maxWidth={2.05} color="#53616c">
        {certification.issuer}
      </Text>
      <Text position={[1.02, -0.56, 0.04]} anchorX="right" anchorY="middle" font="./Vercetti-Regular.woff" fontSize={0.085} color="#53616c">
        {certification.status === "replace" ? "ARCHIVE SLOT" : certification.issued}
      </Text>
    </group>
  );
};

const Inspector = ({ certification, onClose }: { certification: Certification; onClose: () => void }) => (
  <Html fullscreen zIndexRange={[100, 0]}>
    <div className="certificate-inspector-shell" onClick={onClose}>
      <section className="certificate-inspector-card" role="dialog" aria-modal="true" aria-label={certification.title + " details"} onClick={(event) => event.stopPropagation()}>
        <button className="certificate-inspector-close" type="button" onClick={onClose} aria-label="Close certificate details">×</button>
        <p className="certificate-inspector-kicker">{certification.category} / CREDENTIAL ARCHIVE</p>
        <h2>{certification.title}</h2>
        <p className="certificate-inspector-issuer">{certification.issuer}</p>
        <div className="certificate-inspector-meta">
          <span><small>ISSUED</small>{certification.issued}</span>
          <span><small>STATUS</small>{certification.status === "replace" ? "READY TO EDIT" : certification.status.toUpperCase()}</span>
          {certification.expires && <span><small>EXPIRES</small>{certification.expires}</span>}
        </div>
        <p className="certificate-inspector-description">{certification.description}</p>
        <div className="certificate-inspector-skills">
          {certification.skills.map((skill) => <span key={skill}>{skill}</span>)}
        </div>
        {certification.verificationUrl ? (
          <a className="certificate-inspector-link" href={certification.verificationUrl} target="_blank" rel="noreferrer">VERIFY CREDENTIAL ↗</a>
        ) : (
          <span className="certificate-inspector-link certificate-inspector-link-muted">ADD VERIFICATION URL</span>
        )}
      </section>
    </div>
  </Html>
);

const Certifications = () => {
  const { camera } = useThree();
  const data = useScroll();
  const isActive = usePortalStore((state) => state.activePortalId === "certifications");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const selected = CERTIFICATIONS.find((certification) => certification.id === selectedId);

  useEffect(() => {
    data.el.style.overflow = isActive ? "hidden" : "auto";
    if (isActive) {
      gsap.to(camera.position, { z: isMobile ? 11.5 : 11.8, y: -39, x: 0, duration: 1 });
    } else {
      setSelectedId(null);
      setHoveredId(null);
    }
    return () => { data.el.style.overflow = "auto"; };
  }, [camera, data.el, isActive]);

  useFrame((state, delta) => {
    if (!isActive || isMobile) return;
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -(state.pointer.x * Math.PI) / 5, 0.03);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 11.8 - state.pointer.y * 0.65, 5, delta);
  });

  return (
    <group>
      <mesh position={[0, 0, -2.8]}>
        <planeGeometry args={[8, 6]} />
        <meshBasicMaterial color="#466d91" transparent opacity={0.26} />
      </mesh>
      <Text position={[0, 2.35, 0]} anchorX="center" font="./Vercetti-Regular.woff" fontSize={0.115} letterSpacing={0.22} color="#dbe8f1">CERTIFICATION ARCHIVE</Text>
      <Text position={[0, 2.02, 0]} anchorX="center" font="./Vercetti-Regular.woff" fontSize={0.09} letterSpacing={0.06} color="#a9c0d2">SELECT A FRAME TO INSPECT THE CREDENTIAL</Text>
      {CERTIFICATIONS.map((certification, index) => (
        <ArchiveFrame key={certification.id} certification={certification} index={index} selected={selectedId === certification.id} hovered={hoveredId === certification.id} onSelect={setSelectedId} onHover={setHoveredId} />
      ))}
      {selected && <Inspector certification={selected} onClose={() => setSelectedId(null)} />}
    </group>
  );
};

export default Certifications;
