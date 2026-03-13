import TelemetryWidget from "./TelemetryWidget";
import LockIndicator from "./LockIndicator";

export default function HudRoot({
  title,
  subtitle,
  alert,
  telemetry = [],
  tone = "normal",
}) {
  return (
    <div className={`hud-root hud-root--${tone}`}>

      <div className="hud-panel">

        <div className="hud-header">
          <h1 className="hud-title">{title}</h1>
          {subtitle && (
            <p className="hud-subtitle">{subtitle}</p>
          )}
        </div>

        <div className="hud-divider" />

        <LockIndicator locked={tone === "danger"} />

        <div className="hud-divider" />

        <div className="hud-telemetry">
          {telemetry.map((t, i) => (
            <TelemetryWidget
              key={i}
              label={t.label}
              value={t.value}
            />
          ))}
        </div>

        {alert && (
          <>
            <div className="hud-divider" />

            <div className="hud-alert">
              {alert}
            </div>
          </>
        )}

      </div>
    </div>
  );
}