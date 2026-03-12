import Galaxy from "./Galaxy";

export default function BackgroundGalaxy({
  density = 3,
  glowIntensity = 0.2,
  saturation = 0,
  hueShift = 0,
  twinkleIntensity = 0.1,
  mouseInteraction = false,
  mouseRepulsion = false,
}) {
  return (
    <div className="background-galaxy">
      <Galaxy
        mouseRepulsion={mouseRepulsion}
        mouseInteraction={mouseInteraction}
        density={density}
        glowIntensity={glowIntensity}
        saturation={saturation}
        hueShift={hueShift}
        twinkleIntensity={twinkleIntensity}
      />
    </div>
  );
}