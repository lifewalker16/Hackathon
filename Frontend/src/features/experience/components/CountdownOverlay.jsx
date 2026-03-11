export default function CountdownOverlay({ value }) {
  if (value == null) return null;

  return (
    <div className="experience-countdown">
      <div className="experience-countdown__value">{value}</div>
    </div>
  );
}