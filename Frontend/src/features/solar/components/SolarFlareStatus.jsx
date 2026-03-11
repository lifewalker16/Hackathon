export default function SolarFlareStatus({ status, message }) {
  if (status === "loading") {
    return <div className="solar-status">Loading solar flare data...</div>;
  }

  if (status === "error") {
    return <div className="solar-status solar-status--error">{message}</div>;
  }

  if (status === "empty") {
    return <div className="solar-status">No flare data found for this range.</div>;
  }

  return null;
}