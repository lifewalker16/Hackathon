import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Vignette, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

import Earth from "./scene/shared/Earth";
import Milkyway from "./scene/backgrounds/Milkyway";

const STAGES = {
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

function TypewriterText({ text }) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    let frame = 0;
    let cancelled = false;

    function step() {
      frame += 1;
      const charCount = Math.min(text.length, Math.floor(frame * 0.6));

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
  }, [text]);

  return <span>{visibleText}</span>;
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

  useFrame(({ clock }, delta) => {
    const globalGroup = globalRef.current;
    if (!globalGroup) return;

    const time = clock.getElapsedTime();
    const nowMs = time * 1000;

    const wobbleX = Math.sin(time * 0.5) * 0.005;
    const wobbleY = Math.cos(time * 0.6) * 0.005;

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

      camera.position.lerp(targetPos, 0.04);

      camera.position.x += wobbleX;
      camera.position.y += wobbleY;

      if (
        progress === 1 &&
        elapsed >= INITIAL_ZOOM_DURATION + ZOOM_HOLD_BEFORE_ALIGN
      ) {
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

      camera.position.lerp(finalAlignPos, 0.05);

      globalGroup.position.x = THREE.MathUtils.lerp(
        globalGroup.position.x,
        -0.5,
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

    camera.lookAt(0, 0, 0);
  });

  return null;
}

function RotatingEarth({ stage }) {
  const earthRef = useRef(null);

  useFrame((state, delta) => {
    if (!earthRef.current) return;

    if (stage !== STAGES.VIDEO) {
      earthRef.current.rotation.y += 0.004 * delta * 60;
    }
  });

  return (
    <group ref={earthRef}>
      <Earth />
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
  const [stage, setStage] = useState(STAGES.ZOOM_IN);
  const [showTyping, setShowTyping] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const zoomStartTime = useRef(null);
  const alignStartTime = useRef(null);
  const globalRef = useRef(null);

  useEffect(() => {
    const typingTimeout = setTimeout(() => setShowTyping(true), TYPING_START);

    return () => clearTimeout(typingTimeout);
  }, []);

  const handleVideoEnd = () => {
    if (typeof onComplete === "function") {
      onComplete();
    }
  };

  return (
    <div className="earth-page">
      <Canvas camera={{ position: [15, 5, 30], fov: 50 }} shadows>
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
          />

          <OrbitControls enableZoom={false} enableRotate={false} />

          <Suspense fallback={null}>
            <Milkyway />
            <RotatingEarth stage={stage} />
            <Environment preset="night" />
          </Suspense>
        </group>

        <EffectComposer disableNormalPass>
          <Bloom intensity={1.2} />
          <Vignette offset={0.3} darkness={0.8} />
        </EffectComposer>
      </Canvas>

      {showTyping && stage === STAGES.ZOOM_IN && (
        <div className="earth-page__typing-overlay">
          <TypewriterText text="ORBITAL INGRESS COMMENCING..." />
        </div>
      )}

      {showFinalText && stage !== STAGES.VIDEO && (
        <div className="earth-page__final-overlay">
          <p>
            <strong>TARGET ACQUIRED:</strong> Terra Nova (Earth). Magnetic Field
            integrity nominal. Atmosphere stabilized.
            <br />
            <br />
            Mission parameters dictate immediate departure. Magnetic shields
            engaged.
            <br />
            <strong>INITIATE HYPERDRIVE SEQUENCE.</strong>
          </p>
        </div>
      )}

      {showVideo && (
        <div className="earth-page__video-layer">
          <video
            src="/videos/satellite.mp4"
            autoPlay
            playsInline
            muted
            onEnded={handleVideoEnd}
            className="earth-page__video"
          />
        </div>
      )}
    </div>
  );
}