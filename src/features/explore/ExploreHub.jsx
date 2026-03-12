import OverlayCard from "../../components/ui/OverlayCard";
import PrimaryButton from "../../components/ui/PrimaryButton";
import SceneHeader from "../../components/ui/SceneHeader";
import CopyBlock from "../../components/ui/CopyBlock";
import { SCENES } from "../../lib/sceneRegistry";

export default function ExploreHub({ onOpenScene }) {
  return (
    <section className="page">
      <SceneHeader
        eyebrow="Explore"
        title="Choose a Scene"
        description="Start with the strongest modules first and upgrade the rest in controlled phases."
      />

      <div className="grid">
        <OverlayCard title="Earth Experience">
          <CopyBlock
            body="A cinematic Earth-focused scene with camera motion, overlays, and immersive atmosphere."
          />
          <div className="card-actions">
            <PrimaryButton onClick={() => onOpenScene(SCENES.EARTH)}>
              Open Earth
            </PrimaryButton>
          </div>
        </OverlayCard>

        <OverlayCard title="Solar Flare Experience">
          <CopyBlock
            body="A Sun-centered module for viewing solar flare activity with a better UI and cleaner data handling."
          />
          <div className="card-actions">
            <PrimaryButton onClick={() => onOpenScene(SCENES.SOLAR)}>
              Open Solar
            </PrimaryButton>
          </div>
        </OverlayCard>
      </div>
    </section>
  );
}