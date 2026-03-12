import PrimaryButton from "../../components/ui/PrimaryButton";
import SceneHeader from "../../components/ui/SceneHeader";

export default function HomePage({ onStart }) {
  return (
    <section className="page page--hero">
      <SceneHeader
        eyebrow="Takeover Build"
        title="Space Explorer"
        description="A cinematic interactive experience focused on Earth, the Sun, solar activity, and immersive space visuals. BLA Bla bla"
      />

      <div className="hero-copy">
        <p>
          We are rebuilding this project into a polished frontend-first product:
          cleaner architecture, stronger visuals, better scene flow, and real feature ownership.
          well honestly.. dk what im doing..
        </p>
      </div>

      <div className="hero-actions">
        <PrimaryButton onClick={onStart}>Enter Experience</PrimaryButton>
      </div>
    </section>
  );
}