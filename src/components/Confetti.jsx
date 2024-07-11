import React, { useRef } from "react";
import Realistic from "react-canvas-confetti/dist/presets/realistic";

function Confetti() {
  const conductorRef = useRef(null);

  const handleInit = ({ conductor }) => {
    conductorRef.current = conductor;

    // Stop the animation after 3 seconds
    setTimeout(() => {
      if (conductorRef.current) {
        conductorRef.current.stop();
      }
    }, 3000);
  };

  return <Realistic autorun={{ speed: 0.3 }} onInit={handleInit} />;
}

export default Confetti;
