import DeepStarfield from "./DeepStarfield";
import ForegroundStars from "./ForegroundStars";
import NebulaField from "./NebulaField";
import Milkyway from "../../components/scene/backgrounds/Milkyway";

export default function CinematicGalaxyEnvironment({
  milkyWayRadius = 75,
  deepStarCount = 5000,
  foregroundStarCount = 1200,
}) {
  return (
    <>
      <DeepStarfield count={deepStarCount} />
      <Milkyway radius={milkyWayRadius} />
      <NebulaField />
      <ForegroundStars count={foregroundStarCount} />
    </>
  );
}