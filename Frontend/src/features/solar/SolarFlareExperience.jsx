import { useEffect, useMemo, useState } from "react";
import SceneHeader from "../../components/ui/SceneHeader";
import PrimaryButton from "../../components/ui/PrimaryButton";
import SolarFlareStatus from "./components/SolarFlareStatus";
import SolarFlarePanel from "./components/SolarFlarePanel";
import { fetchSolarFlares } from "./lib/flare.api";
import { getStrongestFlare, normalizeFlareItem } from "./lib/flare.utils";
import SolarFlarePosition from "../../components/SolarFlarePosition";
import { SceneFrame } from "../../components/scene/shared";

export default function SolarFlareExperience({ onBack }) {
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [flares, setFlares] = useState([]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setStatus("loading");
        setErrorMessage("");

        const data = await fetchSolarFlares({
          startDate: "2024-01-01",
          endDate: "2024-12-31",
        });

        if (!active) return;

        const normalized = data.map(normalizeFlareItem);
        setFlares(normalized);

        if (normalized.length === 0) {
          setStatus("empty");
        } else {
          setStatus("ready");
        }
      } catch (error) {
        if (!active) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load solar flare data."
        );
        setStatus("error");
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const strongestFlare = useMemo(() => getStrongestFlare(flares), [flares]);

  return (
    <section className="page page--scene">
      <div className="page__topbar">
        <PrimaryButton onClick={onBack}>Back</PrimaryButton>
      </div>

      <SceneHeader
        eyebrow="Solar Activity"
        title="Solar Flare Experience"
        description="A cleaned solar module with better data flow, UI structure, and future-ready feature separation."
      />

      <SolarFlareStatus status={status} message={errorMessage} />

      <div className="solar-layout">
        <div className="scene-stage solar-layout__stage">
          <SceneFrame>
            <SolarFlarePosition flare={strongestFlare} flares={flares} />
          </SceneFrame>
        </div>

        <SolarFlarePanel flare={strongestFlare} />
      </div>
    </section>
  );
}