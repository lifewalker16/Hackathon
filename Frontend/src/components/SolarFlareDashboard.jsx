import React, { useState } from "react";
import "./SolarFlareDashboard.css";

export default function SolarFlareDashboard() {
  const [duration, setDuration] = useState("");
  const [hour, setHour] = useState("");
  const [dayOfYear, setDayOfYear] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Info about flare class
  const flareInfo = {
    C: {
      color: "#4ade80", // green
      description:
        "Small flares. Usually minor, barely noticeable on Earth, may cause minor radio disturbances.",
    },
    M: {
      color: "#facc15", // yellow
      description:
        "Medium flares. Can cause brief radio blackouts at polar regions and minor effects on satellites.",
    },
    X: {
      color: "#f87171", // red
      description:
        "Major flares. Can trigger widespread radio blackouts, satellite disruptions, and affect power grids.",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration: parseFloat(duration),
          hour: parseInt(hour),
          day_of_year: parseInt(dayOfYear),
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch prediction");
      setPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">🌞 Solar Flare Dashboard</h1>

        <div className="card">
          <h2 className="card-title">
            ⚡ Predict Solar Flare Class? 
            <span className="tooltip">
              ❓
              <span className="tooltip-text">
                Enter the flare’s duration, hour, and day of the year to predict its class (C, M, or X). 
                This uses historical solar flare data and a machine learning model.
              </span>
            </span>
          </h2>

          <form className="form" onSubmit={handleSubmit}>
            {/* Duration */}
            <label>
              Duration (minutes) :
              <span className="tooltip">
                ❓
                <span className="tooltip-text">
                  Enter how long the solar flare lasts — e.g., 5 to 300 minutes.
                  Longer durations often mean stronger flares.
                </span>
              </span>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </label>

            {/* Hour of Day */}
            <label>
              Hour of Day (0–23) :
              <span className="tooltip">
                ❓
                <span className="tooltip-text">
                  Enter the hour (in 24-hour format) when the flare was observed or expected.
                  For example, 13 = 1 PM.
                </span>
              </span>
              <input
                type="number"
                min="0"
                max="23"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                required
              />
            </label>

            {/* Day of Year */}
            <label>
              Day of Year (1–365) :
              <span className="tooltip">
                ❓
                <span className="tooltip-text">
                  Enter which day of the year (1 for Jan 1, 365 for Dec 31).
                  Helps identify seasonal solar activity patterns.
                </span>
              </span>
              <input
                type="number"
                min="1"
                max="365"
                value={dayOfYear}
                onChange={(e) => setDayOfYear(e.target.value)}
                required
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Predicting..." : "Predict"}
            </button>
          </form>

          {prediction && (
            <div
              className={`prediction-result prediction-${prediction.prediction_class}`}
            >
              <div
                className="prediction-header"
                style={{
                  backgroundColor: flareInfo[prediction.prediction_class].color,
                }}
              >
                <span className="prediction-icon">
                  {prediction.prediction_class === "X"
                    ? "⚠️"
                    : prediction.prediction_class === "M"
                    ? "⚡"
                    : "🌞"}
                </span>
                <h3
                  style={{
                    color:
                      prediction.prediction_class === "X" ? "#fff" : "#000",
                  }}
                >
                  {prediction.prediction_class}-Class Flare Prediction
                </h3>
              </div>

              <div className="prediction-body">
                <p
                  style={{
                    color: flareInfo[prediction.prediction_class].color,
                    fontWeight: 600,
                  }}
                >
                  <strong>Class :</strong>{" "}
                  {prediction.prediction_class}
                </p>
                <p
                  style={{
                    color: flareInfo[prediction.prediction_class].color,
                    fontStyle: "italic",
                  }}
                >
                  <strong>Impact :</strong>{" "}
                  {flareInfo[prediction.prediction_class].description}
                </p>
              </div>
            </div>
          )}

          {error && <p className="error">{error}</p>}
        </div>
      </div>
      <div className="sparkle">✨</div>
    </div>
  );
}
