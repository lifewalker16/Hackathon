# Space Experience - Interactive 3D Journey

An interactive **Three.js / React Three Fiber** cinematic experience that takes the user through a guided space sequence.

The experience simulates a short space mission workflow starting inside a cockpit and ending with a cinematic Earth view.

---

# Experience Flow

The application runs as a **single guided sequence** controlled by a master experience controller.

1. **Cockpit Intro**

   * User enters the cockpit view
   * Subtle camera animation and wobble

2. **Launch Ready**

   * System text appears
   * Launch button becomes available

3. **Launch Countdown**

   * Countdown sequence: **3 → 2 → 1**

4. **Cockpit Launch**

   * Camera pushes forward
   * Cockpit movement animation plays

5. **Sun Entry**

   * Transition to a 3D Sun model

6. **Solar Flare Visualization**

   * NASA DONKI solar flare data visualized on a rotating Sun

7. **Earth Scene**

   * Cinematic Earth model reveal

8. **Completion**

   * Final sequence ends

---

# Tech Stack

* **React**
* **React Three Fiber**
* **Three.js**
* **@react-three/drei**
* **@react-three/postprocessing**
* **react-spring (3D animations)**
* **Vite**

---

# Project Structure

```
src/
 ├─ app/
 │   ├─ App.jsx
 │   └─ app.css
 │
 ├─ components/
 │   ├─ scene/
 │   │   ├─ backgrounds/
 │   │   │   ├─ BackgroundGalaxy.jsx
 │   │   │   ├─ BackgroundVideo.jsx
 │   │   │   └─ Milkyway.jsx
 │   │   │
 │   │   └─ shared/
 │   │       ├─ Cockpit.jsx
 │   │       ├─ Sun.jsx
 │   │       └─ Earth.jsx
 │   │
 │   ├─ EarthPage.jsx
 │   └─ SolarFlarePosition.jsx
 │
 ├─ features/
 │   └─ experience/
 │       ├─ SpaceExperience.jsx
 │       ├─ hooks/
 │       │   └─ useExperienceSequence.js
 │       ├─ components/
 │       │   ├─ CountdownOverlay.jsx
 │       │   └─ ExperienceOverlay.jsx
 │       └─ lib/
 │           └─ experienceStages.js
 │
 └─ assets/
```

---

# Master Experience Controller

The application uses a **stage-based controller** to manage the cinematic sequence.

Stages include:

```
cockpit-intro
cockpit-ready
countdown
cockpit-launch
sun-entry
solar-flare
earth-entry
complete
```

The controller ensures that scenes transition smoothly without relying on page navigation.

---

# Installation

Clone the repository:

```bash
git clone https://github.com/lifewalker16/Hackathon
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

# Notes

* Some WebGL warnings from Three.js may appear in the console; most are harmless and related to shader precision or browser GPU drivers.
* Ensure video and model assets exist in the `public` directory to avoid runtime loading errors.

---
