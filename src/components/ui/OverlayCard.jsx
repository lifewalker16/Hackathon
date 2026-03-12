export default function OverlayCard({ title, children, className = "" }) {
  return (
    <div className={`overlay-card ${className}`.trim()}>
      {title ? <h3 className="overlay-card__title">{title}</h3> : null}
      <div className="overlay-card__body">{children}</div>
    </div>
  );
}