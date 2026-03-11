export default function IntroBackdrop() {
  return (
    <div className="intro-backdrop" aria-hidden="true">
      <div className="intro-backdrop__stars" />
      <div className="intro-backdrop__glow intro-backdrop__glow--one" />
      <div className="intro-backdrop__glow intro-backdrop__glow--two" />
    </div>
  );
}