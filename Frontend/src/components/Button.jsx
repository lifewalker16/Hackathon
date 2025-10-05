import React from "react";
import "./Button.css";

export default function Button({ text = "Launch", onClick }) {
  return (
    <div
      className="button-container"
      onClick={onClick}
      style={{ cursor: "pointer", position: "relative", display: "inline-block" }}
    >
          <div className="button">{text}</div>
          <div className="button-gradient"></div>
    </div>
  );
}
