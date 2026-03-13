export default function Reticle() {
  return (
    <div className="hud-reticle" aria-hidden="true">
      <span className="hud-reticle__ring" />
      <span className="hud-reticle__cross hud-reticle__cross--h" />
      <span className="hud-reticle__cross hud-reticle__cross--v" />
    </div>
  );
}