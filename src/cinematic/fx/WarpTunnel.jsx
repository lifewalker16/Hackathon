import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function WarpTunnel({ active }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current || !active) return;

    ref.current.rotation.z += 0.001;

    const scale = 1 + Math.sin(clock.elapsedTime * 3) * 0.1;

    ref.current.scale.set(scale, scale, scale * 4);
  });

  return (
    <mesh ref={ref} rotation={[0, 0, 0]}>
      <cylinderGeometry args={[5, 0.5, 200, 64, 1, true]} />
      <meshBasicMaterial
        color="#88ccff"
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}