import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function EarthHalo() {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();
    const pulse = 1.28 + Math.sin(t * 0.9) * 0.02;

    ref.current.scale.set(pulse, pulse, pulse);
    ref.current.rotation.y = t * 0.03;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.28, 48, 48]} />
      <meshBasicMaterial
        color="#7fd0ff"
        transparent
        opacity={0.08}
        depthWrite={false}
      />
    </mesh>
  );
}