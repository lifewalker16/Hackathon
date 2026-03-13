import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function SolarScanPulse() {
  const meshRef = useRef(null);
  const materialRef = useRef(null);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;

    const t = clock.getElapsedTime();
    const scale = 1.5 + Math.sin(t * 1.5) * 0.4;

    mesh.scale.set(scale, scale, scale);
    material.opacity = 0.15 + Math.sin(t * 2) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <ringGeometry args={[1.9, 2.1, 64]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#44bbff"
        transparent
        opacity={0.2}
        depthWrite={false}
      />
    </mesh>
  );
}