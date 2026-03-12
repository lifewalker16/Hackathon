export function parseHeliographicCoordinate(value) {
  if (!value || typeof value !== "string") return null;

  const match = value.trim().match(/^([NS])(\d{1,2})([EW])(\d{1,3})$/i);
  if (!match) return null;

  const [, latDir, latRaw, lonDir, lonRaw] = match;

  const latitude = Number(latRaw) * (latDir.toUpperCase() === "S" ? -1 : 1);
  const longitude = Number(lonRaw) * (lonDir.toUpperCase() === "W" ? -1 : 1);

  return { latitude, longitude };
}

export function latLonToSpherePosition(latitude, longitude, radius = 2.2) {
  const lat = (latitude * Math.PI) / 180;
  const lon = (longitude * Math.PI) / 180;

  const x = radius * Math.cos(lat) * Math.sin(lon);
  const y = radius * Math.sin(lat);
  const z = radius * Math.cos(lat) * Math.cos(lon);

  return [x, y, z];
}

export function normalizeFlareItem(item) {
  const sourceLocation = item?.sourceLocation ?? null;
  const parsed = parseHeliographicCoordinate(sourceLocation);

  return {
    id: item?.flrID ?? crypto.randomUUID(),
    classType: item?.classType ?? "Unknown",
    beginTime: item?.beginTime ?? null,
    peakTime: item?.peakTime ?? null,
    endTime: item?.endTime ?? null,
    sourceLocation,
    link: item?.link ?? null,
    activeRegionNum: item?.activeRegionNum ?? null,
    parsedPosition: parsed,
  };
}

export function getStrongestFlare(flares) {
  if (!Array.isArray(flares) || flares.length === 0) return null;

  const ranked = [...flares].sort((a, b) => {
    const aClass = String(a.classType || "");
    const bClass = String(b.classType || "");
    return bClass.localeCompare(aClass);
  });

  return ranked[0];
}

export function formatDateTime(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}