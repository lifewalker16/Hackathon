import { useEffect, useState } from "react";

export default function TelemetryWidget({ label, value }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (typeof value !== "number") {
      setDisplayValue(value);
      return;
    }

    let frame;

    const start = parseFloat(displayValue) || 0;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    function animate(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const current = start + (end - start) * progress;

      setDisplayValue(current.toFixed(2));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    }

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div className="hud-telemetry-row">

      <span className="hud-telemetry-label">
        {label}
      </span>

      <span className="hud-telemetry-value">
        {displayValue}
      </span>

    </div>
  );
}