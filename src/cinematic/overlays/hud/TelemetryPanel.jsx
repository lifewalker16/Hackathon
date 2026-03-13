export default function TelemetryPanel({ items = [] }) {
  if (!items.length) return null;

  return (
    <aside className="hud-telemetry">
      <div className="hud-telemetry__header">Telemetry</div>

      <div className="hud-telemetry__body">
        {items.map((item) => (
          <div className="hud-telemetry__row" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </aside>
  );
}