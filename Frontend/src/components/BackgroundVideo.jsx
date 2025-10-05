import React, { forwardRef } from "react";
import "./BackgroundVideo.css";

const BackgroundVideo = forwardRef(({ zoomed }, ref) => {
  return (
    <video
      ref={ref}
      loop={false}
      muted
      className={`background-video ${zoomed ? "zoomed" : ""}`}
    >
      <source src="/videos/space.mp4" type="video/mp4" />
    </video>
  );
});

export default BackgroundVideo;
