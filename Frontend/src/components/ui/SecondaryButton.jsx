export default function SecondaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
}) {
  return (
    <button
      type={type}
      className="secondary-button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}