import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";

function SunModel({ onAnimationComplete }) {
  const { scene } = useGLTF("/models/sun.glb");
  const ref = useRef();

  // Animate Sun position smoothly with react-spring
const { position, scale } = useSpring({
  from: { position: [0, 0, -700], scale: 0.5 },  // smaller at start
  to: { position: [0, 0, -50], scale: 1 },      // bigger at end
  config: { duration: 8000 },
  onRest: () => {
      if (onAnimationComplete) onAnimationComplete();
  }
});


  // Rotate slowly
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
    }
  });

 return <a.primitive ref={ref} object={scene} scale={scale} position={position} />;
}

// Preload for faster loading
useGLTF.preload("/models/sun.glb");

export default function Sun({ onZoomFinished }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 50], fov: 60 }} // perspective camera
      style={{ position: "absolute", top: 0, left: 0, zIndex: 5 }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={2} />

      {/* Sun */}
      <SunModel onAnimationComplete={onZoomFinished} />

      {/* Optional: allow orbiting around the sun */}
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
