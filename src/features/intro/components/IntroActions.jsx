import PrimaryButton from "../../../components/ui/PrimaryButton";
import SecondaryButton from "../../../components/ui/SecondaryButton";

export default function IntroActions({ onEnter, onSkip }) {
  return (
    <div className="intro-actions">
      <PrimaryButton onClick={onEnter}>Enter Experience</PrimaryButton>
      <SecondaryButton onClick={onSkip}>Skip to Explore</SecondaryButton>
    </div>
  );
}