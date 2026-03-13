import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";

import HudRoot from "../overlays/hud/HudRoot";
import SolarScanGrid from "../fx/SolarScanGrid";
import SolarScanPulse from "../fx/SolarScanPulse";
import FlareTarget from "../fx/FlareTarget";
import CinematicSun from "../fx/CinematicSun";
import CameraDirector, { CAMERA_MODES } from "../director/CameraDirector";
import useSolarFlareData from "../hooks/useSolarFlareData";

export default function SolarApproachScene({ onComplete }) {
  const { flare, flarePosition, status } = useSolarFlareData();
  const [flareDetected, setFlareDetected] = useState(false);

  useEffect(() => {
    const detectionTimer = window.setTimeout(() => {
      setFlareDetected(true);
    }, 2200);

    const endTimer = window.setTimeout(() => {
      if (typeof onComplete === "function") {
        onComplete();
      }
    }, 9000);

    return () => {
      window.clearTimeout(detectionTimer);
      window.clearTimeout(endTimer);
    };
  }, [onComplete]);

  const telemetry = useMemo(() => {
    if (status === "loading") {
      return [
        { label: "Target", value: "Sol" },
        { label: "Data Feed", value: "Loading" },
        { label: "Scan Mode", value: "Spectral" },
      ];
    }

    if (status === "error") {
      return [
        { label: "Target", value: "Sol" },
        { label: "Data Feed", value: "Error" },
        { label: "Fallback", value: "Enabled" },
      ];
    }

    if (flareDetected && flare) {
      return [
        { label: "Star", value: "Sol" },
        { label: "Flare Class", value: flare.classType || "Unknown" },
        { label: "Source", value: flare.sourceLocation || "Unknown" },
      ];
    }

    return [
      { label: "Target", value: "Sol" },
      { label: "Scan Mode", value: "Spectral" },
      { label: "Radiation", value: "Rising" },
    ];
  }, [status, flareDetected, flare]);

  const subtitle = useMemo(() => {
    if (status === "loading") return "Loading solar event feed";
    if (status === "error") return "Using fallback scan mode";
    if (flareDetected && flare) return "Solar flare detected";
    return "Scanning stellar surface";
  }, [status, flareDetected, flare]);

  const alert = useMemo(() => {
    if (status === "loading") return "Connecting to DONKI";
    if (status === "error") return "Live data unavailable";
    if (flareDetected && flare) return "Radiation spike detected";
    return "Spectral scan active";
  }, [status, flareDetected, flare]);

  const flareMarkerPosition = flarePosition || [1.55, 0.45, 1.15];

  return (
    <div className="scene-root">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={["#020305"]} />
        <ambientLight intensity={0.2} />
        <CameraDirector mode={CAMERA_MODES.PUSH} />

        <Suspense fallback={null}>
          <group scale={1.45}>
            <CinematicSun />
            <SolarScanGrid />
            <SolarScanPulse />
            {flareDetected ? (
              <FlareTarget position={flareMarkerPosition} />
            ) : null}
          </group>
        </Suspense>

        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={0.05}
            luminanceSmoothing={0.2}
            intensity={2.2}
          />
          <Vignette offset={0.18} darkness={0.75} />
        </EffectComposer>
      </Canvas>

      <HudRoot
        title="Solar Analysis"
        subtitle={subtitle}
        alert={alert}
        telemetry={telemetry}
        tone={flareDetected ? "danger" : "warning"}
      />

      {flareDetected ? (
        <div className="solar-alert">
          ⚠ SOLAR FLARE ACTIVITY DETECTED
        </div>
      ) : null}

      {status === "error" ? (
        <div className="solar-data-warning">
          Live flare data unavailable. Showing fallback target.
        </div>
      ) : null}
    </div>
  );
}