import PrimaryButton from "../../../components/ui/PrimaryButton";
import { EXPERIENCE_STAGES } from "../lib/experienceStages";

export default function ExperienceOverlay({
  stage,
  onLaunch,
}) {
  return (
    <>
      {stage === EXPERIENCE_STAGES.COCKPIT_READY ? (
        <div className="experience-overlay experience-overlay--center">
          <div className="experience-panel experience-panel--danger">
            <p className="experience-panel__eyebrow">Flight Deck Ready</p>
            <h2>Systems primed for launch</h2>
            <p>
              Orbital ingress complete. Awaiting manual ignition sequence.
            </p>
            <div className="experience-panel__actions">
              <PrimaryButton onClick={onLaunch}>INITIATE LAUNCH</PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}

      {stage === EXPERIENCE_STAGES.COCKPIT_INTRO ? (
        <div className="experience-overlay experience-overlay--top">
          <div className="experience-panel">
            <p className="experience-panel__eyebrow">Cockpit Sequence</p>
            <h2>Entering command view...</h2>
            <p>Stabilizing navigation systems and aligning flight controls.</p>
          </div>
        </div>
      ) : null}

      {stage === EXPERIENCE_STAGES.SUN_ENTRY ? (
        <div className="experience-overlay experience-overlay--top">
          <div className="experience-panel">
            <p className="experience-panel__eyebrow">Solar Transition</p>
            <h2>Star lock acquired</h2>
            <p>Approaching the Sun before flare mapping begins.</p>
          </div>
        </div>
      ) : null}

      {stage === EXPERIENCE_STAGES.SOLAR_FLARE ? (
        <div className="experience-overlay experience-overlay--top">
          <div className="experience-panel">
            <p className="experience-panel__eyebrow">Solar Analysis</p>
            <h2>Flare position detected</h2>
            <p>Displaying real flare activity on the solar surface.</p>
          </div>
        </div>
      ) : null}

      {stage === EXPERIENCE_STAGES.EARTH_ENTRY ? (
        <div className="experience-overlay experience-overlay--top">
          <div className="experience-panel">
            <p className="experience-panel__eyebrow">Earth Sequence</p>
            <h2>Homeworld visual acquired</h2>
            <p>Transitioning to the final cinematic Earth scene.</p>
          </div>
        </div>
      ) : null}

      {stage === EXPERIENCE_STAGES.COMPLETE ? (
        <div className="experience-overlay experience-overlay--center">
          <div className="experience-panel">
            <p className="experience-panel__eyebrow">Sequence Complete</p>
            <h2>Experience finished</h2>
            <p>The cinematic launch flow has completed successfully.</p>
          </div>
        </div>
      ) : null}
    </>
  );
}