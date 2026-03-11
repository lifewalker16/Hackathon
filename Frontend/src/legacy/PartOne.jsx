import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Howl } from "howler";

import TextOverlay from "./TextOverlay";
import Button from "./Button";
import Sun from "./Sun";
import SunTextOverlay from "./SunTextOverlay";
import ExploreButton from "./ExploreButton";
import SolarFlareDashboard from "./SolarFlareDashboard";
import Cockpit from "../components/scene/shared/Cockpit";
import BackgroundGalaxy from "../components/scene/backgrounds/BackgroundGalaxy";
import BackgroundVideo from "../components/scene/backgrounds/BackgroundVideo";

function PartOne({ onExplore }) {
  const videoRef = useRef(null);

  const [showUI, setShowUI] = useState(false);
  const [showText, setShowText] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [showCockpit, setShowCockpit] = useState(true);
  const [showVideo, setShowVideo] = useState(true);
  const [showGalaxy, setShowGalaxy] = useState(false);
  const [wobble, setWobble] = useState(false);
  const [zoomOut, setZoomOut] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showSunText, setShowSunText] = useState(false);
  const [showExploreButton, setShowExploreButton] = useState(false);

  const rocketSound = useMemo(
    () =>
      new Howl({
        src: ["/sounds/rocket.mp3"],
        volume: 1,
      }),
    []
  );

  const countdownSound = useMemo(
    () =>
      new Howl({
        src: ["/sounds/countdown.mp3"],
        volume: 1,
      }),
    []
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setWobble(true);
      rocketSound.play();
    };

    const handleEnded = () => {
      setZoomOut(true);
      setShowGalaxy(true);
      setWobble(false);
      rocketSound.stop();
    };

    video.onplay = handlePlay;
    video.onended = handleEnded;

    return () => {
      video.onplay = null;
      video.onended = null;
      rocketSound.stop();
      countdownSound.stop();
    };
  }, [rocketSound, countdownSound]);

  const executeLaunch = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.play();
    }

    setShowText(false);
    setShowButton(false);
  }, []);

  const handleLaunchClick = useCallback(() => {
    setShowButton(false);
    setShowCountdown(true);
  }, []);

  const handleCharTyped = useCallback(
    (char) => {
      if (char === "3" || char === "2" || char === "1") {
        countdownSound.play();
      }
    },
    [countdownSound]
  );

  const handleSentenceComplete = useCallback(
    (sentence) => {
      if (sentence === "Ready for launch?") {
        setShowButton(true);
      }

      if (sentence === "1") {
        setTimeout(() => {
          setShowCountdown(false);
          executeLaunch();
        }, 500);
      }
    },
    [executeLaunch]
  );

  const handleSunNarrationComplete = useCallback(() => {
    setShowExploreButton(true);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {showVideo && <BackgroundVideo ref={videoRef} zoomed />}

      {showGalaxy && (
        <>
          <BackgroundGalaxy />
          <Sun onZoomFinished={() => setShowSunText(true)} />
        </>
      )}

      {showSunText && (
        <>
          <div
            style={{
              position: "absolute",
              top: "3rem",
              left: "3rem",
              zIndex: 20,
              maxWidth: "42rem",
            }}
          >
            <SunTextOverlay
              text={[
                "There it is - The Sun. Our closest star. It gives us light and heat, but it also drives space weather with bursts of energy and streams of particles. Space weather means the weather in space caused by the Sun. Just like clouds, rain, and wind change our weather on Earth, the Sun makes changes in space with light, heat, and charged particles.",
              ]}
              onSentenceComplete={handleSunNarrationComplete}
            />

            {showExploreButton && (
              <div style={{ marginLeft: "1rem", marginTop: "1.5rem" }}>
                <ExploreButton onClick={onExplore}>Next</ExploreButton>
              </div>
            )}
          </div>

          <div
            style={{
              position: "absolute",
              top: "3rem",
              right: "3rem",
              zIndex: 20,
            }}
          >
            <SolarFlareDashboard />
          </div>
        </>
      )}

      {showCockpit && (
        <Cockpit
          wobble={wobble}
          zoomOut={zoomOut}
          onAnimationComplete={() => {
            setShowUI(true);
          }}
          onZoomOutComplete={() => {
            setShowCockpit(false);
            setShowVideo(false);
          }}
        />
      )}

      {showUI && showText && !showCountdown && (
        <div style={{ position: "absolute", top: 50, left: 50 }}>
          <TextOverlay
            text={[
              "Attention, young astronaut",
              "Your mission is to explore the cosmic weather and glowing skies",
              "Ready for launch?",
            ]}
            typingSpeed={60}
            pauseDuration={1200}
            deletingSpeed={30}
            onSentenceComplete={handleSentenceComplete}
          />
        </div>
      )}

      {showUI && showCountdown && (
        <div
          style={{
            position: "absolute",
            top: 50,
            left: 50,
            fontSize: "5rem",
            zIndex: 30,
          }}
        >
          <TextOverlay
            text={["3", "2", "1"]}
            typingSpeed={200}
            pauseDuration={800}
            deletingSpeed={50}
            onSentenceComplete={handleSentenceComplete}
            showCursor={false}
            style={{ fontSize: "8rem" }}
            onCharTyped={handleCharTyped}
          />
        </div>
      )}

      {showUI && showButton && (
        <div
          style={{
            position: "absolute",
            bottom: "7.2rem",
            left: "28%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <Button text="Launch" onClick={handleLaunchClick} />
        </div>
      )}
    </div>
  );
}

export default PartOne;