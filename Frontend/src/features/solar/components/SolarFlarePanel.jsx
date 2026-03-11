import OverlayCard from "../../../components/ui/OverlayCard";
import StatusBadge from "../../../components/ui/StatusBadge";
import { formatDateTime } from "../lib/flare.utils";

export default function SolarFlarePanel({ flare }) {
  if (!flare) {
    return (
      <OverlayCard title="Solar Flare Details">
        <p>No flare selected.</p>
      </OverlayCard>
    );
  }

  return (
    <OverlayCard title="Solar Flare Details" className="solar-panel">
      <div className="solar-panel__meta">
        <StatusBadge tone="warning">{flare.classType}</StatusBadge>
      </div>

      <div className="solar-panel__row">
        <span>Source</span>
        <strong>{flare.sourceLocation || "Unknown"}</strong>
      </div>

      <div className="solar-panel__row">
        <span>Begin</span>
        <strong>{formatDateTime(flare.beginTime)}</strong>
      </div>

      <div className="solar-panel__row">
        <span>Peak</span>
        <strong>{formatDateTime(flare.peakTime)}</strong>
      </div>

      <div className="solar-panel__row">
        <span>End</span>
        <strong>{formatDateTime(flare.endTime)}</strong>
      </div>

      <div className="solar-panel__row">
        <span>Region</span>
        <strong>{flare.activeRegionNum ?? "Unknown"}</strong>
      </div>
    </OverlayCard>
  );
}