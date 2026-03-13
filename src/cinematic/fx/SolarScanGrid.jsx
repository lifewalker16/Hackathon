import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function SolarScanGrid() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;

    ref.current.rotation.z = clock.getElapsedTime() * 0.02;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -1]}>
      <ringGeometry args={[1.8, 2.2, 64]} />
      <meshBasicMaterial
        color="#88ccff"
        transparent
        opacity={0.25}
        wireframe
      />
    </mesh>
  );
}