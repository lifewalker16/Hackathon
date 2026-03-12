import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader, BackSide } from "three";

const TEXTURE_PATH = "/textures/milkyway.jpg";

export default function Milkyway({
  radius = 50,
  widthSegments = 48,
  heightSegments = 48,
}) {
  const texture = useLoader(TextureLoader, TEXTURE_PATH);

  const materialProps = useMemo(
    () => ({
      map: texture,
      side: BackSide,
    }),
    [texture]
  );

  return (
    <mesh>
      <sphereGeometry args={[radius, widthSegments, heightSegments]} />
      <meshBasicMaterial {...materialProps} />
    </mesh>
  );
}