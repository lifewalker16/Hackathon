import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

const MODEL_PATH = "/models/sun.glb";

export default function Sun(props) {
  const { scene } = useGLTF(MODEL_PATH);
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1;
    }
  });

  return <primitive ref={ref} object={scene} {...props} />;
}

useGLTF.preload(MODEL_PATH);