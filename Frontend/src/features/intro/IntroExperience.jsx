import IntroBackdrop from "./components/IntroBackdrop";
import IntroHero from "./components/IntroHero";
import IntroActions from "./components/IntroActions";
import IntroLoader from "./components/IntroLoader";
import useIntroSequence from "./hooks/useIntroSequence";

export default function IntroExperience({ onEnter, onSkip }) {
  const { isBooting, isHero } = useIntroSequence();

  return (
    <section className="intro-page">
      <IntroBackdrop />

      <div className="intro-page__content">
        {isBooting ? <IntroLoader /> : null}

        {isHero ? (
          <div className="intro-page__hero">
            <IntroHero />
            <IntroActions onEnter={onEnter} onSkip={onSkip} />
          </div>
        ) : null}
      </div>
    </section>
  );
}