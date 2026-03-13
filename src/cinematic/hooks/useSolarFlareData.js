import { useEffect, useMemo, useState } from "react";
import {
  fetchSolarFlares,
  latLonToSunPosition,
  parseHeliographicCoordinates,
  pickStrongestFlare,
} from "../lib/solarData";

export default function useSolarFlareData() {
  const [flare, setFlare] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setStatus("loading");
        setError("");

        const data = await fetchSolarFlares({
          signal: controller.signal,
        });

        const strongest = pickStrongestFlare(data);

        if (!strongest) {
          setFlare(null);
          setStatus("empty");
          return;
        }

        setFlare(strongest);
        setStatus("ready");
      } catch (err) {
        if (err?.name === "AbortError") return;

        setFlare(null);
        setError(err instanceof Error ? err.message : "Failed to load flare data.");
        setStatus("error");
      }
    }

    load();

    return () => controller.abort();
  }, []);

  const flarePosition = useMemo(() => {
    if (!flare?.sourceLocation) return null;

    const parsed = parseHeliographicCoordinates(flare.sourceLocation);
    if (!parsed) return null;

    return latLonToSunPosition(parsed.latitude, parsed.longitude, 1.55);
  }, [flare]);

  return {
    flare,
    flarePosition,
    status,
    error,
  };
}