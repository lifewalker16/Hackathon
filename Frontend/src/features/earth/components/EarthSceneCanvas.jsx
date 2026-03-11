import EarthPage from "../../../components/EarthPage";
import { SceneFrame } from "../../../components/scene/shared";

export default function EarthSceneCanvas({ onComplete }) {
  return (
    <SceneFrame className="earth-scene-canvas">
      <EarthPage onComplete={onComplete} />
    </SceneFrame>
  );
}