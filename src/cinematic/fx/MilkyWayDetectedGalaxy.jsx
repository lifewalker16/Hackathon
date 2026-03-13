import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

function mixColor(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

export default function MilkyWayDetectedGalaxy({
  coreCount = 7000,
  diskCount = 22000,
  hazeCount = 9000,
  radius = 52,
  thickness = 4.8,
  arms = 2,
}) {
  const galaxyRef = useRef(null);
  const hazeRef = useRef(null);

  const core = useMemo(() => {
    const positions = new Float32Array(coreCount * 3);
    const colors = new Float32Array(coreCount * 3);

    const innerA = [1.0, 0.96, 0.88];
    const innerB = [1.0, 0.88, 0.55];

    for (let i = 0; i < coreCount; i += 1) {
      const i3 = i * 3;

      const r = Math.pow(Math.random(), 1.8) * 8.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[i3 + 1] = (Math.random() - 0.5) * 2.4;
      positions[i3 + 2] = Math.sin(phi) * Math.sin(theta) * r * 0.62;

      const t = Math.random();
      const c = mixColor(innerA, innerB, t);

      colors[i3] = c[0];
      colors[i3 + 1] = c[1];
      colors[i3 + 2] = c[2];
    }

    return { positions, colors };
  }, [coreCount]);

  const disk = useMemo(() => {
    const positions = new Float32Array(diskCount * 3);
    const colors = new Float32Array(diskCount * 3);

    const warmCore = [1.0, 0.93, 0.8];
    const blueBand = [0.72, 0.8, 1.0];
    const violetDust = [0.6, 0.52, 0.95];
    const outerDust = [0.88, 0.72, 0.92];

    for (let i = 0; i < diskCount; i += 1) {
      const i3 = i * 3;

      const dist = Math.pow(Math.random(), 0.72) * radius;
      const armOffset = (i % arms) * ((Math.PI * 2) / arms);
      const spiral = dist * 0.24;
      const angle = armOffset + spiral + (Math.random() - 0.5) * 0.55;

      const radialNoise = 0.9 + Math.random() * 0.22;
      const x = Math.cos(angle) * dist * radialNoise;
      const z = Math.sin(angle) * dist * 0.42 * radialNoise;
      const y =
        (Math.random() - 0.5) *
        thickness *
        (1 - Math.min(1, dist / radius)) *
        (0.45 + Math.random() * 0.55);

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      let c;
      const t = dist / radius;

      if (t < 0.16) {
        c = mixColor(warmCore, blueBand, t / 0.16);
      } else if (t < 0.55) {
        c = mixColor(blueBand, violetDust, (t - 0.16) / 0.39);
      } else {
        c = mixColor(violetDust, outerDust, (t - 0.55) / 0.45);
      }

      const tintNoise = 0.92 + Math.random() * 0.16;

      colors[i3] = c[0] * tintNoise;
      colors[i3 + 1] = c[1] * tintNoise;
      colors[i3 + 2] = c[2] * tintNoise;
    }

    return { positions, colors };
  }, [diskCount, radius, thickness, arms]);

  const haze = useMemo(() => {
    const positions = new Float32Array(hazeCount * 3);
    const colors = new Float32Array(hazeCount * 3);

    const hazeA = [0.7, 0.78, 1.0];
    const hazeB = [0.82, 0.7, 0.96];

    for (let i = 0; i < hazeCount; i += 1) {
      const i3 = i * 3;

      const dist = 10 + Math.random() * (radius - 8);
      const angle = Math.random() * Math.PI * 2;

      positions[i3] = Math.cos(angle) * dist;
      positions[i3 + 1] = (Math.random() - 0.5) * 7.5;
      positions[i3 + 2] = Math.sin(angle) * dist * 0.5;

      const c = Math.random() > 0.5 ? hazeA : hazeB;
      const fade = 0.75 + Math.random() * 0.25;

      colors[i3] = c[0] * fade;
      colors[i3 + 1] = c[1] * fade;
      colors[i3 + 2] = c[2] * fade;
    }

    return { positions, colors };
  }, [hazeCount, radius]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = t * 0.01;
      galaxyRef.current.rotation.z = Math.sin(t * 0.08) * 0.015;
    }

    if (hazeRef.current) {
      hazeRef.current.rotation.y = -t * 0.006;
      hazeRef.current.rotation.z = Math.cos(t * 0.05) * 0.01;
    }
  });

  return (
    <group rotation={[0.34, 0.16, -0.08]}>
      <group ref={galaxyRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={core.positions}
              itemSize={3}
              count={core.positions.length / 3}
            />
            <bufferAttribute
              attach="attributes-color"
              array={core.colors}
              itemSize={3}
              count={core.colors.length / 3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.18}
            sizeAttenuation
            vertexColors
            transparent
            opacity={0.98}
            depthWrite={false}
          />
        </points>

        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={disk.positions}
              itemSize={3}
              count={disk.positions.length / 3}
            />
            <bufferAttribute
              attach="attributes-color"
              array={disk.colors}
              itemSize={3}
              count={disk.colors.length / 3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.11}
            sizeAttenuation
            vertexColors
            transparent
            opacity={0.92}
            depthWrite={false}
          />
        </points>
      </group>

      <group ref={hazeRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={haze.positions}
              itemSize={3}
              count={haze.positions.length / 3}
            />
            <bufferAttribute
              attach="attributes-color"
              array={haze.colors}
              itemSize={3}
              count={haze.colors.length / 3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.2}
            sizeAttenuation
            vertexColors
            transparent
            opacity={0.18}
            depthWrite={false}
          />
        </points>
      </group>

      <mesh>
        <sphereGeometry args={[10.5, 40, 40]} />
        <meshBasicMaterial
          color="#fff0cf"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={[3.2, 0.24, 1.5]}>
        <sphereGeometry args={[17, 40, 40]} />
        <meshBasicMaterial
          color="#9ea9ff"
          transparent
          opacity={0.05}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={[4.2, 0.14, 2.1]}>
        <sphereGeometry args={[22, 36, 36]} />
        <meshBasicMaterial
          color="#b89cff"
          transparent
          opacity={0.032}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}