import { useCallback, useMemo, useRef, useState } from "react";
import { EXPERIENCE_STAGES } from "../lib/experienceStages";

export default function useExperienceSequence() {
  const [stage, setStage] = useState(EXPERIENCE_STAGES.COCKPIT_INTRO);
  const [countdownValue, setCountdownValue] = useState(null);

  const timersRef = useRef([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const queueTimeout = useCallback((callback, delay) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  }, []);

  const goToStage = useCallback((nextStage) => {
    setStage(nextStage);
  }, []);

  const beginCockpitReady = useCallback(() => {
    setStage(EXPERIENCE_STAGES.COCKPIT_READY);
  }, []);

  const startCountdown = useCallback(() => {
    clearAllTimers();
    setStage(EXPERIENCE_STAGES.COUNTDOWN);
    setCountdownValue(3);

    queueTimeout(() => setCountdownValue(2), 1000);
    queueTimeout(() => setCountdownValue(1), 2000);

    queueTimeout(() => {
      setCountdownValue(null);
      setStage(EXPERIENCE_STAGES.COCKPIT_LAUNCH);
    }, 3000);
  }, [clearAllTimers, queueTimeout]);

  const moveToSunEntry = useCallback(() => {
    setStage(EXPERIENCE_STAGES.SUN_ENTRY);
  }, []);

  const moveToSolarFlare = useCallback(() => {
    setStage(EXPERIENCE_STAGES.SOLAR_FLARE);
  }, []);

  const moveToEarthEntry = useCallback(() => {
    setStage(EXPERIENCE_STAGES.EARTH_ENTRY);
  }, []);

  const completeExperience = useCallback(() => {
    setStage(EXPERIENCE_STAGES.COMPLETE);
  }, []);

  const controls = useMemo(
    () => ({
      goToStage,
      beginCockpitReady,
      startCountdown,
      moveToSunEntry,
      moveToSolarFlare,
      moveToEarthEntry,
      completeExperience,
      clearAllTimers,
    }),
    [
      goToStage,
      beginCockpitReady,
      startCountdown,
      moveToSunEntry,
      moveToSolarFlare,
      moveToEarthEntry,
      completeExperience,
      clearAllTimers,
    ]
  );

  return {
    stage,
    countdownValue,
    setCountdownValue,
    controls,
  };
}