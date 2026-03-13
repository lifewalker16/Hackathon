import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import WarpStarfield from "../fx/WarpStarfield";
import WarpTunnel from "../fx/WarpTunnel";
import HudRoot from "../overlays/hud/HudRoot";
import CameraDirector, {CAMERA_MODES} from "../director/CameraDirector";

export default function WarpScene({ onComplete }) {
  const [warp, setWarp] = useState(false);
  const [collapsing, setCollapsing] = useState(false);

  useEffect(() => {
    const start = window.setTimeout(() => {
      setWarp(true);
    }, 900);

    const collapse = window.setTimeout(() => {
      setCollapsing(true);
      setWarp(false);
    }, 3800);

    const end = window.setTimeout(() => {
      if (typeof onComplete === "function") onComplete();
    }, 4700);

    return () => {
      window.clearTimeout(start);
      window.clearTimeout(collapse);
      window.clearTimeout(end);
    };
  }, [onComplete]);

  const telemetry = useMemo(
    () => [
      { label: "Drive Output", value: warp ? "100%" : collapsing ? "12%" : "48%" },
      { label: "Hull Stress", value: warp ? "Rising" : collapsing ? "Normalizing" : "Nominal" },
      { label: "Transit", value: warp ? "Superluminal" : collapsing ? "Collapse" : "Charge" },
    ],
    [warp, collapsing]
  );

  return (
    <div className={`scene-root warp-scene ${collapsing ? "warp-scene--collapse" : ""}`}>
      <Canvas camera={{ position: [0, 0, 2], fov: 70 }}>
        <CameraDirector mode={CAMERA_MODES.SHAKE} />
        <Suspense fallback={null}>
          <WarpStarfield warp={warp} />
          <WarpTunnel active={warp} />
        </Suspense>
      </Canvas>

      <HudRoot
        title="Warp Corridor"
        subtitle={
          warp
            ? "Transit underway"
            : collapsing
            ? "Warp field collapsing"
            : "Warp core charging"
        }
        alert={
          warp
            ? "Warp engaged"
            : collapsing
            ? "Preparing exit"
            : "Stand by"
        }
        telemetry={telemetry}
        tone={warp ? "warning" : "default"}
      />
    </div>
  );
}