import React from "react";
import "./EarthButton.css";

export default function ExploreButton({
  onClick,
  children = "EXPLORE", 
  className = "",
  type = "button",
  disabled = false,
  ariaLabel,
  ...otherProps
}) {
  const finalAriaLabel = ariaLabel
    ? ariaLabel
    : typeof children === "string"
    ? `${children} button`
    : "Activate explore button";

  return (
    <button
      type={type}
      className={`explore-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={finalAriaLabel}
      {...otherProps}
    >
      {/* 1. Outer Glow Effect (Behind the button) */}
      <span className="explore-btn__outer-glow" aria-hidden="true" />
      
      {/* 2. Content with Gradient/Glow Text */}
      <span className="explore-btn__content">
        
        {/* --- TEXT IS NOW FIRST --- */}
        {children}
        
        {/* --- ICON IS NOW LAST --- */}
        <svg 
          className="explore-btn__icon"
          viewBox="0 0 24 24" 
          width="20" 
          height="20" 
          aria-hidden="true" 
          focusable="false"
        >
          {/* Arrow SVG path */}
          <path fill="currentColor" d="M13 5l7 7-7 7v-4H4v-6h9V5z" />
        </svg>
      </span>
      
      {/* 3. Subtle Texture/Sheen */}
      <span className="explore-btn__sheen" aria-hidden="true" />
    </button>
  );
}