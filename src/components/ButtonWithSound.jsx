import React, { useEffect, useRef } from "react";
import useAudioManager from "./useAudioManager";

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
  const { playHoverSound, playClickSound } = useAudioManager();

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
          onMouseEnter={() => {
            playHoverSound(isMuted);
          }}
          onClick={() => {
            playClickSound(isMuted);
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
          onMouseEnter={() => {
            playHoverSound(isMuted);
          }}
          onClick={() => {
            playClickSound(isMuted);
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
