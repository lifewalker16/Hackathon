import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";

const SUN_MODEL_PATH = "/models/sun.glb";

const SUN_ANIMATION = {
  from: {
    position: [0, 0, -700],
    scale: 0.5,
  },
  to: {
    position: [0, 0, -50],
    scale: 1,
  },
  duration: 8000,
};

function SunModel({ onAnimationComplete }) {
  const { scene } = useGLTF(SUN_MODEL_PATH);
  const ref = useRef(null);

  const { position, scale } = useSpring({
    from: SUN_ANIMATION.from,
    to: SUN_ANIMATION.to,
    config: { duration: SUN_ANIMATION.duration },
    onRest: () => {
      if (typeof onAnimationComplete === "function") {
        onAnimationComplete();
      }
    },
  });

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.002;
  });

  return (
    <a.primitive
      ref={ref}
      object={scene}
      position={position}
      scale={scale}
    />
  );
}

export default function Sun({ onZoomFinished }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 50], fov: 60 }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 5,
      }}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={2} />

      <SunModel onAnimationComplete={onZoomFinished} />

      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}

useGLTF.preload(SUN_MODEL_PATH);