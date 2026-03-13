import { TRANSITIONS } from "../director/useTransitionDirector";

export default function TransitionOverlay({ transition }) {
  if (!transition) return null;

  return (
    <div
      className={`transition-overlay transition-overlay--${transition}`}
    />
  );
}