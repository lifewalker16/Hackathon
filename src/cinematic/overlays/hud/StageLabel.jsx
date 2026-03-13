export default function StageLabel({ title, subtitle }) {
  return (
    <div className="hud-stage">
      {title ? <p className="hud-stage__eyebrow">{title}</p> : null}
      {subtitle ? <h2 className="hud-stage__title">{subtitle}</h2> : null}
    </div>
  );
}