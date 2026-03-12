import { forwardRef } from "react";
import "./BackgroundVideo.css";

const VIDEO_PATH = "/videos/space.mp4";

const BackgroundVideo = forwardRef(function BackgroundVideo(
  { zoomed = false, autoPlay = true },
  ref
) {
  return (
    <video
      ref={ref}
      className={`background-video${zoomed ? " background-video--zoomed" : ""}`}
      autoPlay={autoPlay}
      loop={false}
      muted
      playsInline
      preload="auto"
    >
      <source src={VIDEO_PATH} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
});

export default BackgroundVideo;