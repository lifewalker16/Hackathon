import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function NebulaGlow() {
  const groupRef = useRef(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.08) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-18, 6, -25]}>
        <sphereGeometry args={[10, 24, 24]} />
        <meshBasicMaterial color="#6a8cff" transparent opacity={0.08} />
      </mesh>

      <mesh position={[14, -4, -22]}>
        <sphereGeometry args={[8, 24, 24]} />
        <meshBasicMaterial color="#7b61ff" transparent opacity={0.07} />
      </mesh>

      <mesh position={[0, 0, -30]}>
        <sphereGeometry args={[18, 24, 24]} />
        <meshBasicMaterial color="#88ccff" transparent opacity={0.04} />
      </mesh>
    </group>
  );
}