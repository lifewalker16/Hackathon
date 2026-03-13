import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function SolarCorona() {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();
    const pulse = 1.2 + Math.sin(t * 1.6) * 0.04;

    ref.current.scale.set(pulse, pulse, pulse);
    ref.current.rotation.y = t * 0.03;
    ref.current.rotation.z = t * 0.02;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.42, 48, 48]} />
      <meshBasicMaterial
        color="#ffb347"
        transparent
        opacity={0.12}
        depthWrite={false}
      />
    </mesh>
  );
}