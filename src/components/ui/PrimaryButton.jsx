export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
}) {
  return (
    <button
      type={type}
      className="primary-button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}