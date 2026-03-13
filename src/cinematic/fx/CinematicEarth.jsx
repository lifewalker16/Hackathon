import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import Earth from "../../components/scene/shared/Earth";
import EarthAtmosphere from "./EarthAtmosphere";
import EarthHalo from "./EarthHalo";

export default function CinematicEarth(props) {
  const groupRef = useRef(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.025;
  });

  return (
    <group ref={groupRef} {...props}>
      <Earth />
      <EarthAtmosphere />
      <EarthHalo />
      <pointLight position={[0, 0, 0]} intensity={1.1} color="#4ea7ff" />
    </group>
  );
}