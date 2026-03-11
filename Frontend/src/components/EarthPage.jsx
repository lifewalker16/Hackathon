import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Vignette, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

import Earth from "./scene/shared/Earth";
import Milkyway from "./scene/backgrounds/Milkyway";

const STAGES = {
  INITIAL: "initial",
  ZOOM_IN: "zoom-in",
  ALIGN_RIGHT: "align-right",
  VIDEO: "video",
};

const INITIAL_ZOOM_DURATION = 9000;
const ALIGNMENT_DURATION = 5000;
const ALIGNMENT_HOLD_TIME = 3000;
const TYPING_START = 1500;
const FINAL_TEXT_DELAY = 100;
const ZOOM_HOLD_BEFORE_ALIGN = 1000;

function cubicEaseInOut(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutQuad(t) {
  return t * (2 - t);
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function TypewriterText({
  text,
  typingSpeed = 40,
  showCursor = true,
  cursorCharacter = "█",
}) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    let frame = 0;
    let cancelled = false;

    function step() {
      frame += 1;
      const charCount = Math.min(
        text.length,
        Math.floor((frame * 16) / typingSpeed)
      );

      setVisibleText(text.slice(0, charCount));

      if (!cancelled && charCount < text.length) {
        timeout = window.setTimeout(step, 16);
      }
    }

    let timeout = window.setTimeout(step, 16);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [text, typingSpeed]);

  return (
    <span>
      {visibleText}
      {showCursor ? cursorCharacter : null}
    </span>
  );
}

function AnimatedCamera({
  stage,
  zoomStartTime,
  alignStartTime,
  globalRef,
  onRequestAlign,
  onShowFinalText,
  onEnterVideo,
}) {
  const { camera } = useThree();

  const initialPos = useMemo(() => new THREE.Vector3(15, 5, 30), []);
  const centerZoomPos = useMemo(() => new THREE.Vector3(-0.5, -0.5, 1.8), []);
  const finalAlignPos = useMemo(() => new THREE.Vector3(0.5, -0.2, 1.2), []);

  useEffect(() => {
    if (stage === STAGES.INITIAL) {
      camera.position.copy(initialPos);
      camera.rotation.set(0, 0, 0);
    }
  }, [camera, initialPos, stage]);

  useFrame(({ clock }, delta) => {
    const globalGroup = globalRef.current;
    if (!globalGroup) return;
    if (stage === STAGES.VIDEO) return;

    const time = clock.getElapsedTime();
    const nowMs = time * 1000;

    const wobbleX = Math.sin(time * 0.5) * 0.005;
    const wobbleY = Math.cos(time * 0.6) * 0.005;
    const rollZ = Math.sin(time * 0.2) * 0.01;

    camera.rotation.z = rollZ;

    if (stage === STAGES.ZOOM_IN) {
      if (zoomStartTime.current === null) {
        zoomStartTime.current = nowMs;
      }

      const elapsed = nowMs - zoomStartTime.current;
      const progress = clamp01(elapsed / INITIAL_ZOOM_DURATION);
      const eased = cubicEaseInOut(progress);

      const targetPos = new THREE.Vector3().lerpVectors(
        initialPos,
        centerZoomPos,
        eased
      );

      targetPos.x += Math.sin(progress * Math.PI) * 2;
      targetPos.y += Math.cos((progress * Math.PI) / 2) * 1;

      const lerpFactor = 0.04 * delta * 60;

      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        targetPos.x + wobbleX,
        lerpFactor
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        targetPos.y + wobbleY,
        lerpFactor
      );
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        targetPos.z,
        lerpFactor
      );

      if (progress === 1 && elapsed >= INITIAL_ZOOM_DURATION + ZOOM_HOLD_BEFORE_ALIGN) {
        onRequestAlign();
      }
    }

    if (stage === STAGES.ALIGN_RIGHT) {
      if (alignStartTime.current === null) {
        alignStartTime.current = nowMs;
      }

      const elapsedAlign = nowMs - alignStartTime.current;
      const alignProgress = clamp01(elapsedAlign / ALIGNMENT_DURATION);
      const eased = easeOutQuad(alignProgress);

      const camLerpFactor = 0.05 * delta * 60;

      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        finalAlignPos.x + wobbleX,
        camLerpFactor
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        finalAlignPos.y + wobbleY,
        camLerpFactor
      );
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        finalAlignPos.z,
        camLerpFactor
      );

      globalGroup.position.x = THREE.MathUtils.lerp(
        globalGroup.position.x,
        -0.5,
        eased
      );

      globalGroup.rotation.y = THREE.MathUtils.lerp(
        globalGroup.rotation.y,
        0,
        eased
      );

      if (elapsedAlign > FINAL_TEXT_DELAY) {
        onShowFinalText();
      }

      if (alignProgress === 1) {
        const totalElapsed = nowMs - alignStartTime.current;
        if (totalElapsed >= ALIGNMENT_DURATION + ALIGNMENT_HOLD_TIME) {
          onEnterVideo();
        }
      }
    }

    const lookAtTarget = new THREE.Vector3(0, 0, 0).lerp(
      globalGroup.position.clone(),
      0.05
    );

    camera.lookAt(lookAtTarget);
  });

  return null;
}

function RotatingEarth({ stage, alignStartTime }) {
  const earthRef = useRef(null);

  useFrame((state, delta) => {
    if (!earthRef.current) return;

    if (stage !== STAGES.INITIAL && stage !== STAGES.VIDEO) {
      earthRef.current.rotation.y += 0.004 * delta * 60;
    }

    if (stage === STAGES.ALIGN_RIGHT && alignStartTime.current !== null) {
      const elapsedAlign =
        state.clock.getElapsedTime() * 1000 - alignStartTime.current;

      const alignProgress = clamp01(elapsedAlign / ALIGNMENT_DURATION);
      const rotationFactor = easeOutQuad(1 - alignProgress) * 0.05 + 0.005;

      earthRef.current.rotation.y += rotationFactor * delta * 60;
      earthRef.current.rotation.x += rotationFactor * 0.2 * delta * 60;
    }
  });

  return (
    <group ref={earthRef} position={[0, 0, 0]}>
      <Earth castShadow receiveShadow />
      <pointLight
        position={[0, 0, 0]}
        intensity={10}
        color="#5882FA"
        distance={2.5}
        decay={1}
      />
    </group>
  );
}

export default function EarthPage({ onComplete }) {
  const [stage, setStage] = useState(STAGES.INITIAL);
  const [showTyping, setShowTyping] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const zoomStartTime = useRef(null);
  const alignStartTime = useRef(null);
  const globalRef = useRef(null);

  const startSimulation = () => {
    if (stage !== STAGES.INITIAL) return;

    zoomStartTime.current = null;
    alignStartTime.current = null;
    setShowTyping(false);
    setShowFinalText(false);
    setShowVideo(false);
    setStage(STAGES.ZOOM_IN);
  };

  useEffect(() => {
    if (stage === STAGES.ZOOM_IN) {
      const typingTimeout = window.setTimeout(
        () => setShowTyping(true),
        TYPING_START
      );

      const hideTypingTimeout = window.setTimeout(() => {
        setShowTyping(false);
      }, INITIAL_ZOOM_DURATION * 0.9);

      return () => {
        window.clearTimeout(typingTimeout);
        window.clearTimeout(hideTypingTimeout);
      };
    }

    if (stage === STAGES.ALIGN_RIGHT) {
      setShowTyping(false);
    }

    if (stage === STAGES.VIDEO) {
      setShowTyping(false);
      setShowFinalText(false);
      setShowVideo(true);
    }
  }, [stage]);

  const handleVideoEnd = () => {
    if (typeof onComplete === "function") {
      onComplete();
    }
  };

  return (
    <div className="earth-page">
      <Canvas
        camera={{ position: [15, 5, 30], fov: 50 }}
        className="earth-page__canvas"
        style={{ visibility: stage === STAGES.VIDEO ? "hidden" : "visible" }}
        shadows
      >
        <color attach="background" args={["#01010A"]} />

        <AnimatedCamera
          stage={stage}
          zoomStartTime={zoomStartTime}
          alignStartTime={alignStartTime}
          globalRef={globalRef}
          onRequestAlign={() => setStage(STAGES.ALIGN_RIGHT)}
          onShowFinalText={() => setShowFinalText(true)}
          onEnterVideo={() => setStage(STAGES.VIDEO)}
        />

        <group ref={globalRef}>
          <ambientLight intensity={0.05} />

          <directionalLight
            position={[20, 10, 15]}
            intensity={2.5}
            color="#FFFFFF"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          <OrbitControls enableZoom={false} enableRotate={false} />

          <Suspense fallback={null}>
            <Milkyway />
            <RotatingEarth stage={stage} alignStartTime={alignStartTime} />
            <Environment preset="night" />
          </Suspense>
        </group>

        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={0.5}
            luminanceSmoothing={0.05}
            intensity={1.2}
          />
          <Vignette offset={0.3} darkness={0.8} />
        </EffectComposer>
      </Canvas>

      {stage === STAGES.INITIAL ? (
        <div className="earth-page__start-overlay">
          <button
            type="button"
            className="earth-page__start-button"
            onClick={startSimulation}
          >
            INITIATE INGRESS
          </button>
        </div>
      ) : null}

      {stage !== STAGES.VIDEO ? (
        <>
          {showTyping && stage === STAGES.ZOOM_IN ? (
            <div className="earth-page__typing-overlay">
              <TypewriterText
                text="ORBITAL INGRESS COMMENCING..."
                typingSpeed={40}
                showCursor
                cursorCharacter="█"
              />
            </div>
          ) : null}

          {showFinalText &&
          (stage === STAGES.ALIGN_RIGHT || stage === STAGES.ZOOM_IN) ? (
            <div className="earth-page__final-overlay">
              <p>
                <strong>TARGET ACQUIRED:</strong> Terra Nova (Earth). Magnetic
                Field integrity nominal. Atmosphere stabilized.
                <br />
                <br />
                Mission parameters dictate immediate departure. Magnetic shields
                engaged. The ship must reach warp velocity before solar
                radiation impact.
                <br />
                <strong>
                  INITIATE HYPERDRIVE SEQUENCE. Prepare for jump.
                </strong>
              </p>
            </div>
          ) : null}
        </>
      ) : null}

      {showVideo ? (
        <div className="earth-page__video-layer">
          <video
            src="/videos/satellite.mp4"
            autoPlay
            playsInline
            muted
            onEnded={handleVideoEnd}
            className="earth-page__video"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ) : null}
    </div>
  );
}