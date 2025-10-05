import React, { useState ,useRef} from "react";
import Cockpit from "./Cockpit";
import TextOverlay from "./TextOverlay";
import Button from "./Button";
import BackgroundVideo from "./BackgroundVideo";
import BackgroundGalaxy from "./BackgroundGalaxy";
import { Howl } from "howler";
import Sun from "./Sun";
import SunTextOverlay from "./SunTextOverlay";
import ExploreButton from "./ExploreButton";
import SolarFlareDashboard from "./SolarFlareDashboard";

function PartOne({ onExplore }) {
  const [showUI, setShowUI] = useState(false);
  const [zoomed, setZoomed] = useState(true);
  const [showText, setShowText] = useState(true); 
  const [zoomOut, setZoomOut] = useState(false); 
  const [showButton,setShowButton] =useState(false);
  const [showCockpit, setShowCockpit] = useState(true);
  const [showVideo,setShowVideo]= useState(true);
  const [showGalaxy,setShowGalaxy]= useState(false);
  const [wobble, setWobble] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showSunText, setShowSunText] = useState(false);
  const [showExploreButton, setShowExploreButton] = useState(false);


  const videoRef = useRef(null);

  const rocketSound = new Howl({
    src: ["/sounds/rocket.mp3"], 
    volume: 1,
  });
  
  const countdownSound = new Howl({
  src: ["/sounds/countdown.mp3"], // replace with your sound file
  volume: 1,
  });

  const keyboardSound = new Howl({
    src: ["/sounds/keyboard.mp3"], // short click/tap
    volume: 0.4,
  });
   
  const executeLaunch = () => {
    if (videoRef.current) {
      videoRef.current.play(); // ▶️ start video on launch
      videoRef.current.onplay = () => {
        setWobble(true);
        rocketSound.play();
      }; 
      videoRef.current.onended = () => {
        setZoomOut(true); // trigger zoom out when video ends
        setShowGalaxy(true);
        setWobble(false);
        rocketSound.stop(); 
      };
    }
    setShowText(false);
    setShowButton(false);
  };
  
  const handleClick = () => {
    setShowButton(false);
    setShowCountdown(true);
  };
  const handleCharTyped = (char) => {
    if (["3", "2", "1"].includes(char)) {
      countdownSound.play();
    }
  };

    const handleSentenceComplete = (sentence, index) => {
    if (sentence === "Ready for launch?") {
      setShowButton(true); // show button after last intro text
    }

    if (sentence === "1") {
      setTimeout(() => {
        setShowCountdown(false);
        executeLaunch();
      }, 500); // short pause after "1"
    }

      if (sentence.endsWith("and charged particles.")) {
        setShowExploreButton(true);
      }
  };


  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative"}}>
              {/* Background video */}

              {showVideo&&(
                <BackgroundVideo ref={videoRef} zoomed={zoomed} />
              )}
               {showGalaxy && (
                <>
                    <BackgroundGalaxy/>
                    <Sun onZoomFinished={() => setShowSunText(true)} />
                </>
               )}
               
                {showSunText && (
                  <>
                      <div style={{ position: 'absolute', top: '3rem', left: '3rem',zIndex: 20  }}>
                          <SunTextOverlay
                            text={[
                              "There it is - The Sun. Our closest star. It gives us light and heat, but it also drives space weather with bursts of energy and streams of particles. Space weather means the 'weather' in space caused by the Sun. Just like clouds, rain, and wind change our weather on Earth, the Sun makes changes in space with light, heat, and charged particles."
                            ]}
                            onSentenceComplete={() => setShowExploreButton(true)} // Show Explore button when done
                          />
                            
                            {showExploreButton && (
                                  <div style={{ marginLeft:"1rem"  ,marginTop: '1.5rem' }}>
                                    <ExploreButton
                                      onClick={() => {
                                        console.log('Exploring...');
                                        if (onExplore) onExplore(); // <-- call the App callback
                                      }}
                                    >
                                      Next
                                    </ExploreButton>
                                  </div>
                            )}
                        </div>
                         <div style={{ position: 'absolute', top: '3rem', right: '3rem',zIndex: 20  }}>

                          <SolarFlareDashboard/>
                         </div>

                  
                  </>
                )}


             {showCockpit && (
                  <Cockpit
                  wobble={wobble}
                  zoomOut={zoomOut} // pass zoomOut to camera
                  onAnimationComplete={() => {
                    setZoomed(false); // remove initial zoom
                    setShowUI(true);
                  }}
                  onZoomOutComplete={() => {
                    setShowCockpit(false)
                    setShowVideo(false)
                  
                  }} 
                />
             )}
              
              {showUI && showText && !showCountdown &&(
                <div style={{ position: "absolute", top: 50, left: 50 }}>
                  <TextOverlay
                    text={[
                      "Attention, young astronaut",
                      // "The Sun sends powerful storms!",
                      "Your mission is to explore the cosmic weather and glowing skies",
                      "Ready for launch?"
                    ]}
                    typingSpeed={60}
                    pauseDuration={1200}
                    deletingSpeed={30}
                    onSentenceComplete={handleSentenceComplete} 
                  />

                </div>
              )} 

              {showUI && showCountdown && (
                  <div style={{ position: "absolute", top: 50, left: 50, fontSize: "5rem"}}>
                    <TextOverlay
                      text={["3", "2", "1"]}
                      typingSpeed={200}
                      pauseDuration={800}
                      deletingSpeed={50}
                      onSentenceComplete={handleSentenceComplete}
                      showCursor={false}
                      style={{fontSize:"8rem"}}
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
                      <Button text="Launch" onClick={handleClick} />
                  </div>
              )}
    </div>
  );
}

export default PartOne;



