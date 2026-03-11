export default function SceneFrame({ children, className = "" }) {
  return <div className={`scene-frame ${className}`.trim()}>{children}</div>;
}