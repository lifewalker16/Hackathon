import "./app.css";
import AppShell from "../components/layout/AppShell";
import SpaceExperience from "../features/experience/SpaceExperience";

export default function App() {
  return (
    <AppShell>
      <SpaceExperience />
    </AppShell>
  );
}