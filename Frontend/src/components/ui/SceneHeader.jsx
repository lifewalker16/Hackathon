export default function SceneHeader({ eyebrow, title, description }) {
  return (
    <header className="scene-header">
      {eyebrow ? <span className="scene-header__eyebrow">{eyebrow}</span> : null}
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </header>
  );
}