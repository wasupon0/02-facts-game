import React, { useEffect, useRef } from "react";

const ButtonWithSound = ({
  isSelected,
  isDisable,
  handleClick,
  children,
  className,
  showCorrectAnswer,
  isCorrect,
  isMuted,

  ...props
}) => {
  const hoverSound = useRef(new Audio("/hover_sound.wav"));
  const selectSound = useRef(new Audio("/select_sound.wav"));

  const playHoverSound = () => {
    hoverSound.current.volume = 0.05;
    hoverSound.current.play();
    hoverSound.current.onended = function () {
      this.remove();
    };
  };

  const playClickSound = () => {
    selectSound.current.volume = 0.25;
    selectSound.current.play();
    selectSound.current.onended = function () {
      this.remove();
    };
  };

  useEffect(() => {
    hoverSound.current.muted = isMuted;
    selectSound.current.muted = isMuted;
  }, [isMuted]);

  return (
    <>
      {showCorrectAnswer ? (
        <button
          className={
            isCorrect
              ? "button-answer"
              : isSelected
              ? "button-wrong"
              : isDisable
              ? "button-disabled-end"
              : className
          }
          disabled={isDisable}
          onMouseEnter={playHoverSound}
          onClick={() => {
            playClickSound();
            handleClick();
          }}
          {...props}
        >
          {children}
        </button>
      ) : (
        <button
          className={
            isSelected
              ? "button-selected"
              : isDisable
              ? "button-disabled"
              : className
          }
          disabled={isDisable}
          onMouseEnter={playHoverSound}
          onClick={() => {
            playClickSound();
            handleClick();
          }}
          {...props}
        >
          {children}
        </button>
      )}
      &nbsp; &nbsp; &nbsp;
    </>
  );
};

export default ButtonWithSound;
