import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import HudRoot from "../overlays/hud/HudRoot";
import CameraDirector, {CAMERA_MODES} from "../director/CameraDirector";
import CinematicGalaxyEnvironment from "../fx/CinematicGalaxyEnvironment";

export default function GalaxyArrivalScene({ onComplete }) {
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => {
      setLocked(true);
    }, 2200);

    const t2 = window.setTimeout(() => {
      if (typeof onComplete === "function") onComplete();
    }, 6200);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onComplete]);

  const telemetry = useMemo(() => {
    if (locked) {
      return [
        { label: "Region", value: "Milky Way" },
        { label: "Star Lock", value: "Sol" },
        { label: "Transit", value: "Stable" },
      ];
    }

    return [
      { label: "Region", value: "Unknown" },
      { label: "Array", value: "Resolving" },
      { label: "Transit", value: "Post-warp" },
    ];
  }, [locked]);

  return (
    <div className="scene-root">
      <Canvas camera={{ position: [0, 4, 22], fov: 60 }}>
        <ambientLight intensity={0.22} />
        <CameraDirector mode={CAMERA_MODES.ORBIT} />

        <Suspense fallback={null}>
          <CinematicGalaxyEnvironment
            milkyWayRadius={90}
            deepStarCount={6500}
            foregroundStarCount={1600}
          />
        </Suspense>

        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.1}
            intensity={0.85}
          />
          <Vignette offset={0.25} darkness={0.7} />
        </EffectComposer>
      </Canvas>

      <HudRoot
        title="Galaxy Arrival"
        subtitle={
          locked
            ? "Local stellar target acquired"
            : "Warp collapse complete"
        }
        alert={locked ? "Sol locked" : "Rebuilding navigation map"}
        telemetry={telemetry}
        tone={locked ? "default" : "warning"}
      />

      <div className={`galaxy-arrival-copy ${locked ? "is-visible" : ""}`}>
        <p>
          {locked
            ? "Milky Way confirmed. Navigation array locked to Sol."
            : "Emerging from warp. Reconstructing local galactic coordinates."}
        </p>
      </div>
    </div>
  );
}