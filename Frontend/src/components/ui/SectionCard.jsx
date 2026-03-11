export default function SectionCard({ title, description, actions }) {
  return (
    <div className="section-card">
      <h3>{title}</h3>
      <p>{description}</p>
      {actions ? <div className="section-card__actions">{actions}</div> : null}
    </div>
  );
}