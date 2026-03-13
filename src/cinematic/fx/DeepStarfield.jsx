import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

export default function DeepStarfield({
  count = 5000,
  radius = 180,
  speed = 0.0008,
}) {
  const pointsRef = useRef(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const r = 60 + Math.random() * (radius - 60);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      array[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      array[i * 3 + 2] = r * Math.cos(phi);
    }

    return array;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += speed * delta * 60;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation
        color="#dfe9ff"
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}