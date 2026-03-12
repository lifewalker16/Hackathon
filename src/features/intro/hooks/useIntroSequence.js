import { useEffect, useState } from "react";

export default function useIntroSequence() {
  const [phase, setPhase] = useState("boot");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPhase("hero");
    }, 1600);

    return () => window.clearTimeout(timer);
  }, []);

  return {
    phase,
    isBooting: phase === "boot",
    isHero: phase === "hero",
  };
}