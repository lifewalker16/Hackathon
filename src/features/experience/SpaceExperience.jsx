import { useEffect } from "react";
import Cockpit from "../../components/scene/shared/Cockpit";
import Sun from "../../components/scene/shared/Sun";
import SolarFlarePosition from "../../components/SolarFlarePosition";
import EarthPage from "../../components/EarthPage";
import useExperienceSequence from "./hooks/useExperienceSequence";
import { EXPERIENCE_STAGES } from "./lib/experienceStages";
import ExperienceOverlay from "./components/ExperienceOverlay";
import CountdownOverlay from "./components/CountdownOverlay";

export default function SpaceExperience() {
  const { stage, countdownValue, controls } = useExperienceSequence();

  useEffect(() => {
    return () => {
      controls.clearAllTimers();
    };
  }, [controls]);

  useEffect(() => {
    if (stage === EXPERIENCE_STAGES.COCKPIT_LAUNCH) {
      const timer = window.setTimeout(() => {
        controls.moveToSunEntry();
      }, 2600);

      return () => window.clearTimeout(timer);
    }

    if (stage === EXPERIENCE_STAGES.SUN_ENTRY) {
      const timer = window.setTimeout(() => {
        controls.moveToSolarFlare();
      }, 5000);

      return () => window.clearTimeout(timer);
    }

    if (stage === EXPERIENCE_STAGES.SOLAR_FLARE) {
      const timer = window.setTimeout(() => {
        controls.moveToEarthEntry();
      }, 7000);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [stage, controls]);

  return (
    <div className="space-experience">
      <ExperienceOverlay
        stage={stage}
        onLaunch={controls.startCountdown}
      />

      <CountdownOverlay value={countdownValue} />

      <div className="space-experience__scene">
        {(stage === EXPERIENCE_STAGES.COCKPIT_INTRO ||
          stage === EXPERIENCE_STAGES.COCKPIT_READY ||
          stage === EXPERIENCE_STAGES.COUNTDOWN ||
          stage === EXPERIENCE_STAGES.COCKPIT_LAUNCH) && (
          <Cockpit
            wobble={
              stage === EXPERIENCE_STAGES.COCKPIT_INTRO ||
              stage === EXPERIENCE_STAGES.COCKPIT_READY
            }
            zoomOut={stage === EXPERIENCE_STAGES.COCKPIT_LAUNCH}
            onAnimationComplete={controls.beginCockpitReady}
            onZoomOutComplete={controls.moveToSunEntry}
          />
        )}

        {stage === EXPERIENCE_STAGES.SUN_ENTRY && (
          <Sun onZoomFinished={controls.moveToSolarFlare} />
        )}

        {stage === EXPERIENCE_STAGES.SOLAR_FLARE && <SolarFlarePosition />}

        {stage === EXPERIENCE_STAGES.EARTH_ENTRY && (
          <EarthPage onComplete={controls.completeExperience} />
        )}
      </div>
    </div>
  );
}