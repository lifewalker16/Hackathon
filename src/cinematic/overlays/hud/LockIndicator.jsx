import { useEffect, useState } from "react";

export default function LockIndicator({ locked }) {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((b) => !b);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`hud-lock ${locked ? "hud-lock--active" : ""}`}>

      <span
        className="hud-lock-dot"
        style={{ opacity: blink ? 1 : 0.35 }}
      />

      <span className="hud-lock-text">
        {locked ? "TARGET LOCKED" : "SCANNING TARGET"}
      </span>

    </div>
  );
}