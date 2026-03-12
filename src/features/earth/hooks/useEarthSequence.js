import { useCallback, useMemo, useRef, useState } from "react";
import {
  EARTH_STAGES,
  INITIAL_ZOOM_DURATION,
  ALIGNMENT_DURATION,
  ALIGNMENT_HOLD_TIME,
  TYPING_START,
} from "../lib/earth.constants";

export default function useEarthSequence() {
  const [stage, setStage] = useState(EARTH_STAGES.IDLE);
  const [showTyping, setShowTyping] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);

  const zoomStartTime = useRef(null);
  const alignStartTime = useRef(null);

  const startSequence = useCallback(() => {
    if (stage !== EARTH_STAGES.IDLE) return;
    setStage(EARTH_STAGES.ZOOM_IN);
    zoomStartTime.current = null;
    alignStartTime.current = null;
    setShowTyping(false);
    setShowFinalText(false);
  }, [stage]);

  const resetSequence = useCallback(() => {
    setStage(EARTH_STAGES.IDLE);
    zoomStartTime.current = null;
    alignStartTime.current = null;
    setShowTyping(false);
    setShowFinalText(false);
  }, []);

  const config = useMemo(
    () => ({
      INITIAL_ZOOM_DURATION,
      ALIGNMENT_DURATION,
      ALIGNMENT_HOLD_TIME,
      TYPING_START,
    }),
    []
  );

  return {
    stage,
    setStage,
    showTyping,
    setShowTyping,
    showFinalText,
    setShowFinalText,
    zoomStartTime,
    alignStartTime,
    startSequence,
    resetSequence,
    config,
  };
}