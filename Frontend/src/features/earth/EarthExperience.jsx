import { useCallback } from "react";
import useEarthSequence from "./hooks/useEarthSequence";
import EarthSceneCanvas from "./components/EarthSceneCanvas";
import EarthOverlay from "./components/EarthOverlay";
import EarthTimelineControls from "./components/EarthTimelineControls";
import { EARTH_STAGES } from "./lib/earth.constants";

export default function EarthExperience({ onBack }) {
  const {
    stage,
    setStage,
    showTyping,
    setShowTyping,
    showFinalText,
    setShowFinalText,
    startSequence,
  } = useEarthSequence();

  const handleSceneComplete = useCallback(() => {
    setStage(EARTH_STAGES.COMPLETE);
    setShowTyping(false);
    setShowFinalText(true);
  }, [setStage, setShowTyping, setShowFinalText]);

  return (
    <section className="page page--scene earth-page-shell">
      <EarthOverlay
        stage={stage}
        showTyping={showTyping}
        showFinalText={showFinalText}
        onStart={() => {
          startSequence();
          setShowTyping(true);
        }}
        onBack={onBack}
      />

      <EarthTimelineControls stage={stage} />

      <div className="scene-stage earth-stage">
        <EarthSceneCanvas onComplete={handleSceneComplete} />
      </div>
    </section>
  );
}