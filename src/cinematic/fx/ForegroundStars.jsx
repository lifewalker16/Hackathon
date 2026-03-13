import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

export default function ForegroundStars({
  count = 1200,
  width = 90,
  height = 60,
  depthMin = -120,
  depthMax = -25,
  speed = 0.0016,
}) {
  const pointsRef = useRef(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      array[i * 3] = (Math.random() - 0.5) * width;
      array[i * 3 + 1] = (Math.random() - 0.5) * height;
      array[i * 3 + 2] = depthMin + Math.random() * (depthMax - depthMin);
    }

    return array;
  }, [count, width, height, depthMin, depthMax]);

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return;

    const t = clock.getElapsedTime();
    pointsRef.current.rotation.y += speed * delta * 60;
    pointsRef.current.rotation.x = Math.sin(t * 0.08) * 0.015;
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
        size={0.08}
        sizeAttenuation
        color="#ffffff"
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}