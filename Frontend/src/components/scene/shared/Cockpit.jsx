import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useSpring } from "@react-spring/three";
import * as THREE from "three";

const COCKPIT_MODEL_PATH = "/models/cockpit/cockpit.glb";

const INITIAL_CAMERA_POSITION = [0.02, -0.014, 0.16];
const INITIAL_LOOK_AT = [0, -1, -5];

const ENTRY_CAMERA_POSITION = [0.002, -0.014, 0.1];
const ENTRY_LOOK_AT = [0, -0.2, -2];
const ENTRY_DURATION = 3000;

const EXIT_CAMERA_POSITION = [0, -0.01, -0.15];
const EXIT_LOOK_AT = [0, -0.02, -1.5];
const EXIT_DURATION = 2000;

function CockpitModel({ wobble = false }) {
  const { scene } = useGLTF(COCKPIT_MODEL_PATH);
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!wobble || !ref.current) return;

    const time = clock.getElapsedTime();
    ref.current.rotation.x = Math.sin(time * 20) * 0.005;
    ref.current.rotation.y = Math.sin(time * 25) * 0.005;
  });

  return <primitive ref={ref} object={scene} scale={0.5} />;
}

function CockpitCamera({
  zoomOut = false,
  onAnimationComplete,
  onZoomOutComplete,
}) {
  const { camera } = useThree();

  const [spring, api] = useSpring(() => ({
    camPos: INITIAL_CAMERA_POSITION,
    lookAt: INITIAL_LOOK_AT,
    config: { duration: ENTRY_DURATION },
  }));

  useEffect(() => {
    api.start({
      camPos: ENTRY_CAMERA_POSITION,
      lookAt: ENTRY_LOOK_AT,
      config: { duration: ENTRY_DURATION },
      onRest: () => {
        if (typeof onAnimationComplete === "function") {
          onAnimationComplete();
        }
      },
    });
  }, [api, onAnimationComplete]);

  useEffect(() => {
    if (!zoomOut) return;

    api.start({
      camPos: EXIT_CAMERA_POSITION,
      lookAt: EXIT_LOOK_AT,
      config: { duration: EXIT_DURATION },
      onRest: () => {
        if (typeof onZoomOutComplete === "function") {
          onZoomOutComplete();
        }
      },
    });
  }, [zoomOut, api, onZoomOutComplete]);

  useFrame(() => {
    const currentPosition = spring.camPos.get();
    const currentLookAt = spring.lookAt.get();

    if (!currentPosition || !currentLookAt) return;

    camera.position.set(
      currentPosition[0],
      currentPosition[1],
      currentPosition[2]
    );

    camera.lookAt(
      new THREE.Vector3(
        currentLookAt[0],
        currentLookAt[1],
        currentLookAt[2]
      )
    );
  });

  return null;
}

export default function Cockpit({
  wobble = false,
  zoomOut = false,
  onAnimationComplete,
  onZoomOutComplete,
}) {
  return (
    <Canvas
      camera={{ fov: 60, near: 0.1, far: 1000 }}
      gl={{ alpha: true }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <CockpitModel wobble={wobble} />
      <CockpitCamera
        zoomOut={zoomOut}
        onAnimationComplete={onAnimationComplete}
        onZoomOutComplete={onZoomOutComplete}
      />
    </Canvas>
  );
}

useGLTF.preload(COCKPIT_MODEL_PATH);