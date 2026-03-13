import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import Cockpit, {
  CockpitCameraRig,
} from "../../components/scene/shared/Cockpit";
import HudRoot from "../overlays/hud/HudRoot";
import CameraDirector, { CAMERA_MODES } from "../director/CameraDirector";
import CinematicGalaxyEnvironment from "../fx/CinematicGalaxyEnvironment";

export default function DeepSpaceScene({
  showNavigation = false,
  showCountdown = false,
  onComplete,
}) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (showCountdown) {
      setCountdown(3);

      const t1 = window.setTimeout(() => setCountdown(2), 1000);
      const t2 = window.setTimeout(() => setCountdown(1), 2000);
      const t3 = window.setTimeout(() => {
        if (typeof onComplete === "function") {
          onComplete();
        }
      }, 3000);

      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.clearTimeout(t3);
      };
    }

    const timer = window.setTimeout(() => {
      if (typeof onComplete === "function") {
        onComplete();
      }
    }, showNavigation ? 3000 : 3500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showCountdown, showNavigation, onComplete]);

  const telemetry = useMemo(() => {
    if (showCountdown) {
      return [
        { label: "Drive Core", value: "Charging" },
        { label: "Vector Lock", value: "Confirmed" },
        { label: "Jump Window", value: "Open" },
      ];
    }

    if (showNavigation) {
      return [
        { label: "Sector", value: "Outer Rim" },
        { label: "Target", value: "Milky Way" },
        { label: "Status", value: "Route Solved" },
      ];
    }

    return [
      { label: "Systems", value: "Online" },
      { label: "Nav Array", value: "Scanning" },
      { label: "Drift Mode", value: "Stable" },
    ];
  }, [showCountdown, showNavigation]);

  const rigShakeIntensity = useMemo(() => {
    if (!showCountdown) return 0;
    if (countdown === 1) return 2.4;
    if (countdown === 2) return 1.65;
    return 1.15;
  }, [showCountdown, countdown]);

  return (
    <div className="scene-root">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
        }}
      >
        {!showCountdown ? (
          <CameraDirector
            mode={showNavigation ? CAMERA_MODES.STABLE : CAMERA_MODES.DRIFT}
          />
        ) : null}

        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <CockpitCameraRig
          shake={showCountdown}
          shakeIntensity={rigShakeIntensity}
        />

        <Suspense fallback={null}>
          <CinematicGalaxyEnvironment
            milkyWayRadius={75}
            deepStarCount={5000}
            foregroundStarCount={900}
          />
          <Cockpit wobble={!showCountdown} />
        </Suspense>
      </Canvas>

      <HudRoot
        title={
          showCountdown
            ? "Launch Sequence"
            : showNavigation
            ? "Navigation Lock"
            : "Deep Space Drift"
        }
        subtitle={
          showCountdown
            ? "Warp ignition countdown"
            : showNavigation
            ? "Local galaxy corridor acquired"
            : "Systems stabilizing in deep space"
        }
        alert={
          showCountdown
            ? "Warp drive primed"
            : showNavigation
            ? "Destination resolved"
            : "Passive scan active"
        }
        telemetry={telemetry}
        tone={showCountdown ? "warning" : "default"}
      />

      {showCountdown ? (
        <div className="countdown countdown--cinematic">{countdown}</div>
      ) : null}
    </div>
  );
}