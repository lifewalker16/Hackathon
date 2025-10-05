import TextType from './TextType';
import './TextOverlay.css';

export default function TextOverlay({
  text,
  typingSpeed = 75,
  pauseDuration = 1000,
  deletingSpeed = 70,
  showCursor = true,
  loop = false,
  cursorCharacter = "!",
  textColors = ["white"],
  onSentenceComplete,
  onCharTyped,
  style,


}) {
  return (
    <div className='text-overlay' style={style}>
      <TextType
        text={text}
        typingSpeed={typingSpeed}
        pauseDuration={pauseDuration}
        deletingSpeed={deletingSpeed}
        showCursor={showCursor}
        loop={loop}
        cursorCharacter={cursorCharacter}
        textColors={textColors}
        onSentenceComplete={onSentenceComplete}
        onCharTyped={onCharTyped}
      />
    </div>
  );
}
