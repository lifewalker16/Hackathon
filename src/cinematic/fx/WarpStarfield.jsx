import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function WarpStarfield({ warp = false }) {
  const ref = useRef();

  const { positions, speeds } = useMemo(() => {
    const starCount = 2000;

    const pos = new Float32Array(starCount * 3);
    const spd = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const r = 200;

      pos[i * 3] = (Math.random() - 0.5) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * r;
      pos[i * 3 + 2] = -Math.random() * r;

      spd[i] = 0.2 + Math.random() * 1.5;
    }

    return { positions: pos, speeds: spd };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;

    const pos = ref.current.geometry.attributes.position.array;

    for (let i = 0; i < speeds.length; i++) {
      const index = i * 3 + 2;

      pos[index] += speeds[i] * delta * (warp ? 200 : 20);

      if (pos[index] > 10) {
        pos[index] = -200;
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          itemSize={3}
          count={positions.length / 3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={warp ? 0.4 : 0.08}
        color="white"
        sizeAttenuation
      />
    </points>
  );
}