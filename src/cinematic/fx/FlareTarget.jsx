import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function FlareTarget({ position = [1.2, 0.4, 1] }) {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 4) * 0.18;

    ref.current.rotation.z = t * 0.7;
    ref.current.scale.set(pulse, pulse, pulse);
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <ringGeometry args={[0.16, 0.19, 40]} />
        <meshBasicMaterial color="#ff2d2d" />
      </mesh>

      <mesh>
        <ringGeometry args={[0.24, 0.27, 40]} />
        <meshBasicMaterial color="#ff6b6b" transparent opacity={0.7} />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}