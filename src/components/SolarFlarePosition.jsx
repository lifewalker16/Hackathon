import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { TextureLoader } from "three";

const SUN_RADIUS = 2;
const NASA_API_BASE = "https://api.nasa.gov/DONKI/FLR";
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";

function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

function getDefaultStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().split("T")[0];
}

function addDays(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

function formatDateTime(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function parseCoordinates(sourceLocation) {
  if (!sourceLocation || typeof sourceLocation !== "string") {
    return { latitude: 0, longitude: 0 };
  }

  const match = sourceLocation.trim().match(/^([NS])(\d{1,2})([EW])(\d{1,3})$/i);
  if (!match) {
    return { latitude: 0, longitude: 0 };
  }

  const [, latDir, latRaw, lonDir, lonRaw] = match;

  const latitude = Number(latRaw) * (latDir.toUpperCase() === "S" ? -1 : 1);
  const longitude = Number(lonRaw) * (lonDir.toUpperCase() === "W" ? -1 : 1);

  return { latitude, longitude };
}

function flarePositionCoords(sourceLocation, radius = SUN_RADIUS) {
  const { latitude, longitude } = parseCoordinates(sourceLocation || "N0E0");

  const latRad = (latitude * Math.PI) / 180;
  const lonRad = (longitude * Math.PI) / 180;

  const x = radius * Math.cos(latRad) * Math.sin(lonRad);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.cos(lonRad);

  return [x, y, z];
}

function getFlareColor(classType) {
  if (!classType) return "#ff8800";
  if (classType.startsWith("X")) return "#ff2d2d";
  if (classType.startsWith("M")) return "#ff7a00";
  if (classType.startsWith("C")) return "#ffbf00";
  if (classType.startsWith("B")) return "#ffe066";
  return "#fff18a";
}

function getFlareStrengthValue(classType) {
  if (!classType) return 0;

  const match = classType.match(/([ABCMX])(\d+\.?\d*)/i);
  if (!match) return 0;

  const [, letterRaw, magnitudeRaw] = match;
  const letter = letterRaw.toUpperCase();
  const magnitude = Number(magnitudeRaw);

  const multiplier = {
    A: 1,
    B: 10,
    C: 100,
    M: 1000,
    X: 10000,
  };

  return (multiplier[letter] || 0) * magnitude;
}

function getFlareIntensity(classType) {
  if (!classType) return 1;

  const match = classType.match(/([ABCMX])(\d+\.?\d*)/i);
  if (!match) return 1;

  const [, letterRaw, magnitudeRaw] = match;
  const letter = letterRaw.toUpperCase();
  const magnitude = Number(magnitudeRaw);

  const baseIntensity = {
    A: 0.3,
    B: 0.5,
    C: 1,
    M: 2,
    X: 4,
  };

  return (baseIntensity[letter] || 1) * (1 + magnitude / 5);
}

function pickBestFlare(data) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const withLocation = data.filter((item) => item?.sourceLocation);
  const candidates = withLocation.length > 0 ? withLocation : data;

  return [...candidates].sort(
    (a, b) => getFlareStrengthValue(b?.classType) - getFlareStrengthValue(a?.classType)
  )[0];
}

function SpaceBackground() {
  const { scene } = useThree();
  const bgTexture = useLoader(TextureLoader, "/textures/starfield.png");

  useEffect(() => {
    scene.background = bgTexture;
    return () => {
      scene.background = null;
    };
  }, [scene, bgTexture]);

  return null;
}

function FlareMarker({ position, intensity, classType }) {
  const meshRef = useRef(null);
  const particlesRef = useRef(null);
  const glowRef = useRef(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (meshRef.current) {
      const pulse = 1 + 0.3 * Math.sin(time * 5);
      meshRef.current.scale.setScalar(pulse);
    }

    if (glowRef.current) {
      const pulse = 1 + 0.2 * Math.sin(time * 3);
      glowRef.current.scale.setScalar(pulse);
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.z = time * 0.5;
    }
  });

  const color = getFlareColor(classType);
  const size = 0.15 * intensity;

  return (
    <group position={position}>
      <mesh ref={glowRef} scale={3}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>

      <mesh scale={2}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>

      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>

      <mesh scale={0.5}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>

      <group ref={particlesRef}>
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index / 12) * Math.PI * 2;
          const distance = size * 4;

          return (
            <mesh
              key={index}
              position={[
                Math.cos(angle) * distance,
                Math.sin(angle) * distance,
                0,
              ]}
            >
              <sphereGeometry args={[size * 0.3, 8, 8]} />
              <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function SunSphere() {
  const sunRef = useRef(null);

  const [colorMap, normalMap] = useTexture([
    "/textures/Scene_-_Root_diffuse.png",
    "/textures/Scene_-_Root_normal.png",
  ]);

  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={sunRef}>
      <sphereGeometry args={[SUN_RADIUS, 64, 64]} />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        metalness={0.15}
        roughness={1}
        emissive="#ff8800"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function SunWithFlares({ flare }) {
  const flareMarker = useMemo(() => {
    if (!flare?.sourceLocation) return null;

    const position = flarePositionCoords(flare.sourceLocation, SUN_RADIUS + 0.05);
    const intensity = getFlareIntensity(flare.classType);

    return (
      <FlareMarker
        position={position}
        intensity={intensity}
        classType={flare.classType}
      />
    );
  }, [flare]);

  return (
    <>
      <SunSphere />
      {flareMarker}
    </>
  );
}

export default function SolarFlarePosition() {
  const [flare, setFlare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState(getDefaultStartDate);

  const maxDate = useMemo(() => getTodayDateString(), []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFlareData() {
      try {
        setLoading(true);
        setError("");

        const endDate = addDays(date, 7);
        const url = new URL(NASA_API_BASE);

        url.searchParams.set("startDate", date);
        url.searchParams.set("endDate", endDate);
        url.searchParams.set("api_key", NASA_API_KEY);

        const response = await fetch(url.toString(), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setFlare(pickBestFlare(data));
      } catch (err) {
        if (err?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to fetch flare data.");
        setFlare(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadFlareData();

    return () => controller.abort();
  }, [date]);

  return (
    <div className="solar-flare-page">
      <div className="solar-flare-page__canvas">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ antialias: true }}
          style={{ width: "100%", height: "100%", background: "transparent" }}
        >
          <Suspense fallback={null}>
            <SpaceBackground />
            <SunWithFlares flare={flare} />
          </Suspense>

          <ambientLight intensity={0.2} />
          <pointLight position={[0, 0, 0]} intensity={1.5} color="#ffaa00" />
          <pointLight position={[10, 10, 10]} intensity={0.3} color="#ffffff" />

          <OrbitControls
            enableZoom
            enablePan={false}
            enableRotate
            minDistance={3}
            maxDistance={10}
            zoomSpeed={0.5}
            rotateSpeed={0.5}
          />
        </Canvas>
      </div>

      <aside className="solar-flare-panel solar-flare-panel--left">
        <h1>🌞 Solar Flare 3D Visualization</h1>
        <p>Real NASA solar flare data mapped onto a 3D Sun model.</p>

        <div className="solar-flare-field">
          <label htmlFor="solar-flare-date">Search from date</label>
          <input
            id="solar-flare-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            max={maxDate}
          />
        </div>

        {loading ? <div className="solar-flare-message">🔄 Loading flare data...</div> : null}
        {error ? <div className="solar-flare-message solar-flare-message--error">❌ {error}</div> : null}

        <div className="solar-flare-help">
          <b>💡 Controls</b>
          <ul>
            <li>Rotate: click and drag</li>
            <li>Zoom: mouse wheel or pinch</li>
            <li>Flare colors: 🔴 X | 🟠 M | 🟡 C</li>
            <li>The marker shows the eruption location</li>
            <li>Source: NASA DONKI</li>
          </ul>
        </div>
      </aside>

      <aside className="solar-flare-panel solar-flare-panel--right">
        {flare ? (
          <>
            <div className="solar-flare-details">
              <h2>⚡ Flare Details</h2>

              <div><b>Flare ID:</b> {flare.flrID || "N/A"}</div>
              <div><b>Class:</b> {flare.classType || "N/A"}</div>
              <div><b>Start:</b> {formatDateTime(flare.beginTime)}</div>
              <div><b>Peak:</b> {formatDateTime(flare.peakTime)}</div>
              <div><b>End:</b> {formatDateTime(flare.endTime)}</div>
              <div><b>Region:</b> {flare.activeRegionNum || "N/A"}</div>
              <div><b>Source:</b> {flare.sourceLocation || "N/A"}</div>
              <div>
                <b>Instruments:</b>{" "}
                {flare.instruments?.map((item) => item.displayName).join(", ") || "N/A"}
              </div>
            </div>

            <div className="solar-flare-events">
              <b>🔗 Linked Events:</b>
              {flare.linkedEvents?.length ? (
                flare.linkedEvents.map((eventItem, index) => (
                  <div key={`${eventItem.activityID || "event"}-${index}`}>
                    • {eventItem.activityID || "Event"}
                  </div>
                ))
              ) : (
                <span>No linked events</span>
              )}
            </div>
          </>
        ) : (
          <div className="solar-flare-empty">
            No flare data found for the selected date range.
          </div>
        )}
      </aside>
    </div>
  );
}