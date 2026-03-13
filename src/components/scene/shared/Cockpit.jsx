import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
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

export function CockpitModel({ wobble = false, ...props }) {
  const { scene } = useGLTF(COCKPIT_MODEL_PATH);
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!wobble || !ref.current) return;

    const time = clock.getElapsedTime();
    ref.current.rotation.x = Math.sin(time * 20) * 0.005;
    ref.current.rotation.y = Math.sin(time * 25) * 0.005;
  });

  return <primitive ref={ref} object={scene} scale={0.5} {...props} />;
}

export function CockpitCameraRig({
  zoomOut = false,
  onAnimationComplete,
  onZoomOutComplete,
  shake = false,
  shakeIntensity = 1,
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

  useFrame(({ clock }) => {
    const currentPosition = spring.camPos.get();
    const currentLookAt = spring.lookAt.get();

    if (!currentPosition || !currentLookAt) return;

    let shakeX = 0;
    let shakeY = 0;
    let shakeZ = 0;

    if (shake) {
      const t = clock.getElapsedTime();
      const base = 0.0025 * shakeIntensity;

      shakeX =
        Math.sin(t * 38) * base +
        (Math.random() - 0.5) * base * 0.65;

      shakeY =
        Math.cos(t * 42) * base +
        (Math.random() - 0.5) * base * 0.65;

      shakeZ =
        Math.sin(t * 28) * base * 0.35;
    }

    camera.position.set(
      currentPosition[0] + shakeX,
      currentPosition[1] + shakeY,
      currentPosition[2] + shakeZ
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

export default function Cockpit(props) {
  return <CockpitModel {...props} />;
}

useGLTF.preload(COCKPIT_MODEL_PATH);