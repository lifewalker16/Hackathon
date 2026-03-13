import { useCallback, useState } from "react";

export const TRANSITIONS = {
  FADE: "fade",
  FLASH: "flash",
  BLOOM: "bloom",
};

export default function useTransitionDirector() {
  const [transition, setTransition] = useState(null);

  const triggerTransition = useCallback((type, duration = 1200) => {
    setTransition(type);

    setTimeout(() => {
      setTransition(null);
    }, duration);
  }, []);

  return {
    transition,
    triggerTransition,
  };
}