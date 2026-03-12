export default function EarthTimelineControls({ stage }) {
  return (
    <div className="earth-timeline">
      <span className="earth-timeline__label">Sequence stage</span>
      <strong>{stage}</strong>
    </div>
  );
}