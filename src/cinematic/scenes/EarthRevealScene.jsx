import { useMemo } from "react";
import EarthPage from "../../components/EarthPage";
import HudRoot from "../overlays/hud/HudRoot";

export default function EarthRevealScene({ onComplete }) {
  const telemetry = useMemo(
    () => [
      { label: "Target", value: "Earth" },
      { label: "Field Integrity", value: "Nominal" },
      { label: "Atmosphere", value: "Stable" },
      { label: "Orbital Lock", value: "Acquired" },
    ],
    []
  );

  return (
    <div className="scene-root earth-reveal-scene">

      <EarthPage
        autoStart
        hideStartOverlay
        onComplete={onComplete}
      />

      <HudRoot
        title="Earth Acquisition"
        subtitle="Homeworld visual confirmed"
        alert="Mission trajectory stabilized"
        telemetry={telemetry}
        tone="default"
        showReticle={false}
      />

      <div className="earth-reveal-caption">
        <p>
          Atmospheric composition confirmed.  
          Visual contact with Terra achieved.
        </p>
      </div>

    </div>
  );
}