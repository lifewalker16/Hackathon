import { useState, useRef, Suspense, useEffect, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Vignette, Bloom } from "@react-three/postprocessing";
import * as THREE from 'three';

import Earth from "./Earth";
import MilkyWay from "./Milkyway";
import TextType from "./TextType";
import ExploreButton from "./EarthButton"; // Assuming this is your button component

// --- CONFIGURATION CONSTANTS (Adjusted for smoother timing) ---
const INITIAL_ZOOM_DURATION = 9000;
// NEW: Total duration for the side-alignment phase (longer hold for the final text)
const ALIGNMENT_DURATION = 5000;
const ALIGNMENT_HOLD_TIME = 3000; 
const TYPING_START = 1500;
// -------------------------------------------------------------------

// Custom cubic ease-in-out function for cinematic feel
const cubicEaseInOut = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutQuad = (t) => t * (2 - t); // Simpler ease out for quick snaps

export default function EarthPage({ onComplete }) {
    // Stage states: initial | zoom-in | align-right | video
    const [stage, setStage] = useState("initial");
    const [showTyping, setShowTyping] = useState(false);
    const [showFinalText, setShowFinalText] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    // Timeline Refs
    const zoomStartTime = useRef(null);
    const alignStartTime = useRef(null);
    const globalRef = useRef();
    const canvasRef = useRef();

    // Function to trigger the animation start
    const startSimulation = () => {
        if (stage === "initial") {
            setStage("zoom-in");
            zoomStartTime.current = null; // Reset start time
        }
    };

    // 1. CINEMATIC CAMERA ANIMATION & TIMELINE LOGIC
    function AnimatedCamera({ stage }) {
        const { camera } = useThree();
        // Camera Key Positions
        const initialPos = useMemo(() => new THREE.Vector3(15, 5, 30), []);
        // Midpoint zoom position (center screen)
        const centerZoomPos = useMemo(() => new THREE.Vector3(-0.5, -0.5, 1.8), []);
        // Final position for the close-up and align on the right
        const finalAlignPos = useMemo(() => new THREE.Vector3(0.5, -0.2, 1.2), []);

        useEffect(() => {
            if (stage === "initial") camera.position.copy(initialPos);
        }, [camera, initialPos, stage]);

        useFrame(({ clock }, delta) => {
            const time = clock.getElapsedTime();
            let lookAtTarget = new THREE.Vector3(0, 0, 0);

            if (stage === "video") return;

            // Continuous Wobble & Roll (Cinematic Jitter)
            const wobbleX = Math.sin(time * 0.5) * 0.005;
            const wobbleY = Math.cos(time * 0.6) * 0.005;
            const rollZ = Math.sin(time * 0.2) * 0.01;
            camera.rotation.z = rollZ;

            // --- PHASE 1: ZOOM-IN (CENTER) ---
            if (stage === "zoom-in") {
                if (zoomStartTime.current === null) zoomStartTime.current = clock.getElapsedTime() * 1000;
                
                const elapsed = clock.getElapsedTime() * 1000 - zoomStartTime.current;
                let progress = Math.min(1, elapsed / INITIAL_ZOOM_DURATION);
                const easedProgress = cubicEaseInOut(progress);

                // Calculate the curving path
                const lerpPos = new THREE.Vector3().lerpVectors(initialPos, centerZoomPos, easedProgress);
                lerpPos.x += Math.sin(progress * Math.PI) * 2; // X-curve
                lerpPos.y += Math.cos(progress * Math.PI / 2) * 1; // Y-curve

                // Apply positional wobble and lerp
                const lerpFactor = 0.04 * delta * 60;
                camera.position.x = THREE.MathUtils.lerp(camera.position.x, lerpPos.x + wobbleX, lerpFactor);
                camera.position.y = THREE.MathUtils.lerp(camera.position.y, lerpPos.y + wobbleY, lerpFactor);
                camera.position.z = THREE.MathUtils.lerp(camera.position.z, lerpPos.z, lerpFactor);
                
                if (progress === 1) {
                    // Show final text after a short hold, then initiate alignment
                    const holdTime = 1000;
                    if (elapsed >= INITIAL_ZOOM_DURATION + holdTime) {
                         setStage("align-right");
                    }
                }

            // --- PHASE 2: ALIGN-RIGHT (FINAL POSITION) ---
            } else if (stage === "align-right") {
                if (alignStartTime.current === null) alignStartTime.current = clock.getElapsedTime() * 1000;

                const elapsedAlign = clock.getElapsedTime() * 1000 - alignStartTime.current;
                const alignProgress = Math.min(1, elapsedAlign / ALIGNMENT_DURATION);

                // Use a high ease-out for a controlled snap/deceleration
                const easeInSharp = easeOutQuad(alignProgress);

                // Camera moves to its final aligned position
                const camLerpFactor = 0.05 * delta * 60;
                camera.position.x = THREE.MathUtils.lerp(camera.position.x, finalAlignPos.x + wobbleX, camLerpFactor);
                camera.position.y = THREE.MathUtils.lerp(camera.position.y, finalAlignPos.y + wobbleY, camLerpFactor);
                camera.position.z = THREE.MathUtils.lerp(camera.position.z, finalAlignPos.z, camLerpFactor);

                // Global group (Earth) snaps left to position it on the screen's right side
                const finalGlobalShift = -0.5;
                globalRef.current.position.x = THREE.MathUtils.lerp(globalRef.current.position.x, finalGlobalShift, easeInSharp);
                
                // Rotation snaps back to straight-on view
                globalRef.current.rotation.y = THREE.MathUtils.lerp(globalRef.current.rotation.y, 0, easeInSharp);
                
                // Show final text immediately upon starting alignment phase
                if (elapsedAlign > 100) setShowFinalText(true);

                // Check for final hold time
                if (alignProgress === 1) {
                    const totalElapsed = clock.getElapsedTime() * 1000 - alignStartTime.current;
                    if (totalElapsed >= ALIGNMENT_DURATION + ALIGNMENT_HOLD_TIME) {
                        setStage("video"); // Trigger video after text hold
                    }
                }
            }
            
            // LookAt must track the center of the global group (now shifted)
            camera.lookAt(lookAtTarget.lerp(globalRef.current.position.clone(), 0.05));
        });

        return null;
    }

    // 2. EARTH ROTATION & GLOBAL SCENE GROUP
    function RotatingEarth({ stage }) {
        const earthRef = useRef();
        const initialRotationSpeed = 0.004;

        useFrame((state, delta) => {
            if (!earthRef.current) return;
            
            // Continuous rotation
            if (stage !== "initial" && stage !== "video") {
                earthRef.current.rotation.y += initialRotationSpeed * delta * 60;
            }
            
            // Increased rotation during the dramatic camera movement
            if (stage === "align-right" && alignStartTime.current) {
                const elapsedAlign = state.clock.getElapsedTime() * 1000 - alignStartTime.current;
                const alignProgress = Math.min(1, elapsedAlign / ALIGNMENT_DURATION);
                // Spin up quickly at the start of alignment
                const rotationFactor = easeOutQuad(1 - alignProgress) * 0.05 + 0.005; 
                
                earthRef.current.rotation.y += rotationFactor * delta * 60;
                earthRef.current.rotation.x += rotationFactor * 0.2 * delta * 60; // Tilt slightly
            }
        });

        return (
            <group ref={earthRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
                <Earth castShadow receiveShadow />
                {/* ATMOSPHERIC GLOW */}
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

    // 3. TIMELINE MANAGEMENT
    useEffect(() => {
        if (stage === "zoom-in") {
            // Show typing text 1.5s after zoom starts
            const typingTimeout = setTimeout(() => setShowTyping(true), TYPING_START);
            
            // Hide typing text just before the alignment phase
            const hideTypingTimeout = setTimeout(() => {
                setShowTyping(false);
            }, INITIAL_ZOOM_DURATION * 0.9);

            return () => {
                clearTimeout(typingTimeout);
                clearTimeout(hideTypingTimeout);
            };
        } else if (stage === "align-right") {
             // The logic to transition to 'video' is now in AnimatedCamera to be frame-accurate.
             // We just need to ensure alignment start time is reset.
             alignStartTime.current = null;
        } else if (stage === "video") {
            setShowFinalText(false);
            setShowVideo(true);
        }
    }, [stage]);

    // Function to handle video end and call onComplete
    const handleVideoEnd = () => {
        if (onComplete) {
            onComplete();
        }
    };


    return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
            
            {/* 1. CANVAS: Renders the 3D scene */}
            <Canvas
                ref={canvasRef}
                camera={{ position: [15, 5, 30], fov: 50 }}
                style={{ visibility: stage === "video" ? 'hidden' : 'visible' }}
                shadows // Ensure shadows are enabled
            >
                <color attach="background" args={['#01010A']} />
                
                <AnimatedCamera stage={stage} />
                
                <group ref={globalRef}>
                    
                    <ambientLight intensity={0.05} />
                    {/* Sun/Primary light source */}
                    <directionalLight
                        position={[20, 10, 15]}
                        intensity={2.5}
                        color="#FFFFFF"
                        castShadow
                        // Shadow properties for realistic Earth shadow
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
                        <MilkyWay />
                        <RotatingEarth stage={stage} />
                    </Suspense>

                </group>

                {/* Cinematic Post-Processing */}
                <EffectComposer disableNormalPass>
                    <Bloom
                        luminanceThreshold={0.5}
                        luminanceSmoothing={0.05}
                        intensity={1.2}
                    />
                    <Vignette
                        offset={0.3}
                        darkness={0.8}
                    />
                </EffectComposer>
            </Canvas>


            {/* 2. START BUTTON OVERLAY */}
            {stage === "initial" && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 10,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)'
                    }}
                >
                    <ExploreButton
                        onClick={startSimulation}
                        children="INITIATE INGRESS"
                    />
                </div>
            )}

            {/* 3. TEXT OVERLAYS */}
            {(stage !== "video") && (
                <>
                    {/* Typing Text during initial zoom-in */}
                    {showTyping && stage === "zoom-in" && (
                        <div
                            style={{
                                position: "absolute",
                                top: "10%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                fontFamily: "'Orbitron', sans-serif",
                                color: "#00FFFF",
                                fontSize: "32px",
                                fontWeight: 600,
                                zIndex: 10,
                                pointerEvents: "none",
                                textShadow: "0 0 15px rgba(0, 255, 255, 0.8)",
                                padding: "5px 15px",
                                border: "1px solid #00FFFF",
                                backgroundColor: "rgba(0, 20, 20, 0.1)",
                            }}
                        >
                            <TextType
                                text={["ORBITAL INGRESS COMMENCING..."]}
                                typingSpeed={40}
                                pauseDuration={1000}
                                showCursor
                                cursorCharacter="█"
                            />
                        </div>
                    )}

                    {/* Final Alignment Text (Narrative) */}
                    {showFinalText && (stage === "align-right" || stage === "zoom-in") && (
                        <div
                            style={{
                                position: "absolute",
                                bottom: "8%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "80%",
                                maxWidth: "700px",
                                textAlign: "left",
                                
                                fontFamily: "'Poppins', sans-serif",
                                color: "#FFFFFF",
                                fontSize: "18px",
                                lineHeight: "1.6",
                                fontWeight: 300,

                                // Container Styling
                                zIndex: 10,
                                background: "rgba(10, 20, 40, 0.7)",
                                borderLeft: "5px solid #00FF00",
                                borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                                padding: "20px 30px",
                                borderRadius: "0 8px 8px 0",
                                boxShadow: "0 0 10px rgba(0, 255, 0, 0.2)",
                                // Fade in the text smoothly
                                opacity: stage === "align-right" ? 1 : 0, 
                                transition: 'opacity 1s ease-in',
                            }}
                        >
                            <p style={{ margin: 0, padding: 0 }}>
                                <strong style={{ color: "#00FF00" }}>TARGET ACQUIRED:</strong> Terra Nova (Earth). Magnetic Field integrity nominal. Atmosphere stabilized.
                                <br /><br />
                                Mission parameters dictate immediate departure. Magnetic shields engaged. The ship must reach warp velocity before solar radiation impact.
                                <br />
                                <strong style={{ color: "#FF9900" }}>INITIATE HYPERDRIVE SEQUENCE. Prepare for jump.</strong>
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* 4. FULL-SCREEN VIDEO CONTAINER */}
            {showVideo && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 20,
                        backgroundColor: "black",
                    }}
                >
                    <video
                        src="/videos/satellite.mp4"
                        autoPlay
                        playsInline
                        muted={true}
                        onEnded={handleVideoEnd}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
        </div>
    );
}