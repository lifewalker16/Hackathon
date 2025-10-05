import React from "react";
import Galaxy from './Galaxy';

export default function BackgroundGalaxy(){
    return(
        <div style={{ width: '100%', height: '100vh', position: 'relative',backgroundColor:"black" }}>
        <Galaxy 
            mouseRepulsion={false}
            mouseInteraction={false}
            density={3}
            glowIntensity={0.2}
            saturation={0}
            hueShift={0}
            twinkleIntensity={0.1}
        />
        </div>
    )
}