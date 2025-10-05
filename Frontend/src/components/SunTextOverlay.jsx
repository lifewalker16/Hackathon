import TextType from './TextType';
import './SunTextOverlay.css';

export default function SunTextOverlay({
  text,
  typingSpeed = 45,
  pauseDuration = 1500,
  deletingSpeed = 30,
  showCursor = true,
  cursorCharacter = "|",
  textColors = ["#FFD580"],
  loop = false,
  style,
  onSentenceComplete, // callback from App
}) {
  return (
    <div className="sun-text-overlay" style={style}>
      <TextType
        text={text}
        typingSpeed={typingSpeed}
        pauseDuration={pauseDuration}
        deletingSpeed={deletingSpeed}
        showCursor={showCursor}
        cursorCharacter={cursorCharacter}
        textColors={textColors}
        loop={loop}
        onSentenceComplete={onSentenceComplete} // fire when Sun text completes
      />
    </div>
  );
}
