import SceneHeader from "../../../components/ui/SceneHeader";

export default function IntroHero() {
  return (
    <div className="intro-hero">
      <SceneHeader
        eyebrow="Rebuilt Experience"
        title="Space Explorer"
        description="A cinematic interactive frontend focused on Earth, the Sun, solar activity, and immersive space storytelling. BLA bla blah"
      />

      <div className="intro-hero__body">
        <p>
          This project is being upgraded from a hackathon prototype into a
          cleaner, modular, portfolio-grade experience.
          well honestly.. dk what im doing..
        </p>
      </div>
    </div>
  );
}