import SceneHeader from "../../../components/ui/SceneHeader";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import OverlayCard from "../../../components/ui/OverlayCard";
import StatusBadge from "../../../components/ui/StatusBadge";

export default function EarthOverlay({
  stage,
  showTyping,
  showFinalText,
  onStart,
  onBack,
}) {
  return (
    <div className="earth-overlay">
      <div className="earth-overlay__top">
        <PrimaryButton onClick={onBack}>Back</PrimaryButton>
      </div>

      <div className="earth-overlay__content">
        <SceneHeader
          eyebrow="Earth"
          title="Earth Cinematic Experience"
          description="We are restructuring the Earth scene into a reusable feature with cleaner sequence control and UI separation."
        />

        <div className="earth-overlay__status">
          <StatusBadge tone="neutral">{stage}</StatusBadge>
        </div>

        {stage === "idle" ? (
          <div className="earth-overlay__actions">
            <PrimaryButton onClick={onStart}>Launch Sequence</PrimaryButton>
          </div>
        ) : null}

        {showTyping ? (
          <OverlayCard title="Sequence Update">
            <p>Approaching orbital view...</p>
          </OverlayCard>
        ) : null}

        {showFinalText ? (
          <OverlayCard title="Sequence Complete">
            <p>
              Earth aligned. Next we can refine transitions, overlays, and the
              narrative layer.
            </p>
          </OverlayCard>
        ) : null}
      </div>
    </div>
  );
}