const NASA_API_BASE = "https://api.nasa.gov/DONKI/FLR";
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || "https://api.nasa.gov/DONKI/FLR";

export function getDateString(date) {
  return date.toISOString().split("T")[0];
}

export function getDefaultSolarDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);

  return {
    startDate: getDateString(start),
    endDate: getDateString(end),
  };
}

export function parseHeliographicCoordinates(sourceLocation) {
  if (!sourceLocation || typeof sourceLocation !== "string") {
    return null;
  }

  const match = sourceLocation.trim().match(/^([NS])(\d{1,2})([EW])(\d{1,3})$/i);
  if (!match) {
    return null;
  }

  const [, latDir, latRaw, lonDir, lonRaw] = match;

  const latitude = Number(latRaw) * (latDir.toUpperCase() === "S" ? -1 : 1);
  const longitude = Number(lonRaw) * (lonDir.toUpperCase() === "W" ? -1 : 1);

  return { latitude, longitude };
}

export function latLonToSunPosition(latitude, longitude, radius = 1.55) {
  const latRad = (latitude * Math.PI) / 180;
  const lonRad = (longitude * Math.PI) / 180;

  const x = radius * Math.cos(latRad) * Math.sin(lonRad);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.cos(lonRad);

  return [x, y, z];
}

export function getFlareStrengthValue(classType) {
  if (!classType || typeof classType !== "string") return 0;

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

export function pickStrongestFlare(flares) {
  if (!Array.isArray(flares) || flares.length === 0) return null;

  const valid = flares.filter((flare) => flare?.sourceLocation);
  const candidates = valid.length > 0 ? valid : flares;

  return [...candidates].sort(
    (a, b) => getFlareStrengthValue(b?.classType) - getFlareStrengthValue(a?.classType)
  )[0];
}

export async function fetchSolarFlares({
  startDate,
  endDate,
  signal,
} = {}) {
  const range = startDate && endDate
    ? { startDate, endDate }
    : getDefaultSolarDateRange();

  const url = new URL(NASA_API_BASE);
  url.searchParams.set("startDate", range.startDate);
  url.searchParams.set("endDate", range.endDate);
  url.searchParams.set("api_key", NASA_API_KEY);

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error(`NASA flare request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Unexpected NASA flare response format.");
  }

  return data;
}