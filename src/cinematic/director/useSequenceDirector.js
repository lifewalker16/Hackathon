import { useCallback, useRef, useState } from "react";
import { SEQUENCE, SEQUENCE_ORDER } from "./SequenceTimeline";

export default function useSequenceDirector() {
  const [scene, setScene] = useState(SEQUENCE.DEEP_SPACE);
  const transitioningRef = useRef(false);

  const nextScene = useCallback(() => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;

    setScene((current) => {
      const index = SEQUENCE_ORDER.indexOf(current);
      const next = SEQUENCE_ORDER[index + 1] || current;
      return next;
    });

    window.setTimeout(() => {
      transitioningRef.current = false;
    }, 50);
  }, []);

  const jumpTo = useCallback((target) => {
    setScene(target);
  }, []);

  return {
    scene,
    nextScene,
    jumpTo,
  };
}