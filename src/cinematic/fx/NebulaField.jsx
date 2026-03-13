import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function NebulaField() {
  const groupRef = useRef(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.01;
    groupRef.current.rotation.z = Math.sin(t * 0.05) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-28, 10, -40]}>
        <sphereGeometry args={[12, 24, 24]} />
        <meshBasicMaterial
          color="#5e7dff"
          transparent
          opacity={0.045}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[24, -8, -35]}>
        <sphereGeometry args={[10, 24, 24]} />
        <meshBasicMaterial
          color="#7d6bff"
          transparent
          opacity={0.04}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0, -55]}>
        <sphereGeometry args={[18, 24, 24]} />
        <meshBasicMaterial
          color="#7fc8ff"
          transparent
          opacity={0.025}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}