import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const CAMERA_MODES = {
  DRIFT: "drift",
  STABLE: "stable",
  SHAKE: "shake",
  ORBIT: "orbit",
  PUSH: "push",
};

export default function CameraDirector({
  mode = CAMERA_MODES.DRIFT,
  intensity = 1,
}) {
  const { camera } = useThree();
  const basePosition = useRef(new THREE.Vector3());

  useEffect(() => {
    basePosition.current.copy(camera.position);
  }, [camera]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    switch (mode) {
      case CAMERA_MODES.DRIFT: {
        camera.position.x = basePosition.current.x + Math.sin(t * 0.1) * 0.2;
        camera.position.y = basePosition.current.y + Math.cos(t * 0.12) * 0.1;
        break;
      }

      case CAMERA_MODES.STABLE: {
        camera.position.lerp(basePosition.current, delta * 2);
        break;
      }

      case CAMERA_MODES.SHAKE: {
        camera.position.x =
          basePosition.current.x + (Math.random() - 0.5) * 0.05 * intensity;
        camera.position.y =
          basePosition.current.y + (Math.random() - 0.5) * 0.05 * intensity;
        break;
      }

      case CAMERA_MODES.ORBIT: {
        const radius = 8;
        camera.position.x = Math.sin(t * 0.1) * radius;
        camera.position.z = Math.cos(t * 0.1) * radius;
        camera.lookAt(0, 0, 0);
        break;
      }

      case CAMERA_MODES.PUSH: {
        camera.position.z -= delta * 0.5;
        break;
      }

      default:
        break;
    }
  });

  return null;
}