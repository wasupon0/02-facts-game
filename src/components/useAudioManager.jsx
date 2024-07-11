import { useRef } from "react";

const useAudioManager = () => {
  const audioPool = useRef([]);

  const getAudio = (src) => {
    let audio = audioPool.current.find((a) => a.src === src && a.paused);
    if (!audio) {
      audio = new Audio(src);
      audioPool.current.push(audio);
    }
    return audio;
  };

  const playHoverSound = (isMuted) => {
    const audio = getAudio("/hover_sound.wav");
    audio.volume = 0.15;
    audio.muted = isMuted;
    audio.play();
    //console.log("playHoverSound!");
  };

  const playClickSound = (isMuted) => {
    const audio = getAudio("/select_sound.wav");
    audio.volume = 0.25;
    audio.muted = isMuted;
    audio.play();
    //console.log("playClickSound!");
  };

  return { playHoverSound, playClickSound };
};

export default useAudioManager;
