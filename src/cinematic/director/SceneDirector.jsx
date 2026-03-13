import { SEQUENCE } from "./SequenceTimeline";

import DeepSpaceScene from "../scenes/DeepSpaceScene";
import WarpScene from "../scenes/WarpScene";
import GalaxyArrivalScene from "../scenes/GalaxyArrivalScene";
import SolarApproachScene from "../scenes/SolarApproachScene";
import EarthRevealScene from "../scenes/EarthRevealScene";
import EndingScene from "../scenes/EndingScene";

export default function SceneDirector({ scene, nextScene }) {
  switch (scene) {
    case SEQUENCE.DEEP_SPACE:
      return <DeepSpaceScene onComplete={nextScene} />;

    case SEQUENCE.NAV_LOCK:
      return <DeepSpaceScene showNavigation onComplete={nextScene} />;

    case SEQUENCE.COUNTDOWN:
      return <DeepSpaceScene showCountdown onComplete={nextScene} />;

    case SEQUENCE.WARP:
      return <WarpScene onComplete={nextScene} />;

    case SEQUENCE.GALAXY_ARRIVAL:
      return <GalaxyArrivalScene onComplete={nextScene} />;

    case SEQUENCE.SOLAR_APPROACH:
      return <SolarApproachScene onComplete={nextScene} />;

    case SEQUENCE.EARTH_REVEAL:
      return <EarthRevealScene onComplete={nextScene} />;

    case SEQUENCE.ENDING:
      return <EndingScene />;

    default:
      return null;
  }
}