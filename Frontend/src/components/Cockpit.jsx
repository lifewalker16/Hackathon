  import React, { useEffect } from "react";
  import { Canvas, useThree, useFrame } from "@react-three/fiber";
  import { useGLTF } from "@react-three/drei";
  import { useSpring } from "@react-spring/three";
  import * as THREE from "three";

function CockpitModel({ wobble }) {
  const { scene } = useGLTF("/models/cockpit/cockpit.glb");
  const ref = React.useRef();

  useFrame(({ clock }) => {
    if (wobble) {
      const t = clock.getElapsedTime();
      // small wobble on x & y rotation
      ref.current.rotation.x = Math.sin(t * 20) * 0.005; 
      ref.current.rotation.y = Math.sin(t * 25) * 0.005;
    }
  });

  return <primitive ref={ref} object={scene} scale={0.5} />;
}


  function CockpitCamera({ onAnimationComplete,zoomOut,onZoomOutComplete }) {   // <-- accept prop
  const { camera } = useThree();

  const [spring, api] = useSpring(() => ({
    camPos: [0.02, -0.014, 0.16],
    lookAt: [0, -1, -5],
    config: { duration: 3000 }
  }));

  useEffect(() => {
    api.start({
      camPos: [0.002, -0.014, 0.1],
      lookAt: [0, -0.2, -2],
      onRest: onAnimationComplete
    });
  }, [api, onAnimationComplete]);
  
    useEffect(() => {
    if (zoomOut) {
      api.start({
        camPos: [0, -0.01, -0.15], // push forward past the dashboard  y is up+ down- , z is backward- forward+ ,
        lookAt: [0, -0.02, -1.5],
        config: { duration: 2000 },
        onRest: onZoomOutComplete
      });
    }
  }, [zoomOut, api, onZoomOutComplete]);

    useFrame(() => {
    const cp = spring.camPos.get();
    const la = spring.lookAt.get();
    if (cp && la) {
      camera.position.set(cp[0], cp[1], cp[2]);
      camera.lookAt(new THREE.Vector3(la[0], la[1], la[2]));
    }
  });


  return null;
}

export default function Cockpit({ onAnimationComplete ,zoomOut,onZoomOutComplete,wobble }) {   // <-- accept from App
  return (
    <Canvas camera={{ fov: 60, near: 0.1, far: 1000 }}
     gl={{alpha:true}}
     style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <CockpitModel wobble={wobble}/>
      <CockpitCamera 
      onAnimationComplete={onAnimationComplete}
      onZoomOutComplete={onZoomOutComplete}
      zoomOut={zoomOut}
      />  {/* <-- pass down */}
    </Canvas>
  );
}
  // Preload model for performance
  useGLTF.preload("/models/cockpit/cockpit.glb");



  