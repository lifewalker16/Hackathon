import { useGLTF } from "@react-three/drei";

const EARTH_MODEL_PATH = "/Earth.gltf";

export default function Earth({ scale = 1.128, ...props }) {
  const { nodes, materials } = useGLTF(EARTH_MODEL_PATH);

  const geometry = nodes?.Object_4?.geometry;
  const material = materials?.["Scene_-_Root"];

  if (!geometry || !material) {
    console.warn("Earth model structure unexpected:", nodes, materials);
    return null;
  }

  return (
    <group {...props} dispose={null}>
      <mesh geometry={geometry} material={material} scale={scale} />
    </group>
  );
}

useGLTF.preload(EARTH_MODEL_PATH);