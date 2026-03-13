import SceneDirector from "../../cinematic/director/SceneDirector";
import useSequenceDirector from "../../cinematic/director/useSequenceDirector";
import useTransitionDirector, {
  TRANSITIONS,
} from "../../cinematic/director/useTransitionDirector";
import TransitionOverlay from "../../cinematic/overlays/TransitionOverlay";

import { useEffect } from "react";

export default function SpaceExperience() {
  const { scene, nextScene } = useSequenceDirector();
  const { transition, triggerTransition } = useTransitionDirector();

  useEffect(() => {
    switch (scene) {
      case "warp":
        triggerTransition(TRANSITIONS.FLASH);
        break;

      case "solar-approach":
        triggerTransition(TRANSITIONS.BLOOM);
        break;

      case "earth-reveal":
        triggerTransition(TRANSITIONS.FADE);
        break;

      default:
        break;
    }
  }, [scene, triggerTransition]);

  return (
    <div className="cinematic-root">

      <SceneDirector scene={scene} nextScene={nextScene} />

      <TransitionOverlay transition={transition} />

    </div>
  );
}