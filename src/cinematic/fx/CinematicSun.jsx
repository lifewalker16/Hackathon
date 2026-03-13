import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import SolarPlasmaShell from "./SolarPlasmaShell";
import SolarCorona from "./SolarCorona";

export default function CinematicSun() {
  const groupRef = useRef(null);
  const coreRef = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.06;
    }

    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 1.4) * 0.015;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.1, 64, 64]} />
        <meshBasicMaterial color="#ff9b2f" />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.16, 48, 48]} />
        <meshBasicMaterial
          color="#ffb347"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      <SolarPlasmaShell radius={1.22} intensity={0.95} />
      <SolarCorona />
      <pointLight position={[0, 0, 0]} intensity={4} color="#ff9b3d" />
    </group>
  );
}