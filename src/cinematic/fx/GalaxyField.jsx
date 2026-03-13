import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

export default function GalaxyField() {
  const pointsRef = useRef(null);

  const positions = useMemo(() => {
    const count = 4000;
    const array = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const radius = Math.random() * 80;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 8;

      const spiral = radius * 0.18;
      const finalAngle = angle + spiral;

      array[i * 3] = Math.cos(finalAngle) * radius;
      array[i * 3 + 1] = height;
      array[i * 3 + 2] = Math.sin(finalAngle) * radius;
    }

    return array;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.015;
  });

  return (
    <points ref={pointsRef} rotation={[0.2, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        sizeAttenuation
        color="#cfe8ff"
        transparent
        opacity={0.9}
      />
    </points>
  );
}