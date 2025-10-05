// src/components/MilkyWay.jsx
import React from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const MilkyWay = () => {
  // load texture from textures folder
  const texture = useLoader(TextureLoader, "/textures/milkyway.jpg");

  return (
    <mesh>
      {/* Big sphere around Earth */}
      <sphereGeometry args={[50, 64, 64]} />
      {/* side={2} makes texture render inside the sphere */}
      <meshBasicMaterial map={texture} side={2} />
    </mesh>
  );
};

export default MilkyWay;
