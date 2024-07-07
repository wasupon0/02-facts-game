import { nanoid } from "nanoid";
import React from "react";
import ButtonWithSound from "./ButtonWithSound";

const MultiChoice = ({
  questionArray,
  handleChoiceClick,
  resetAnswer,
  showCorrectAnswer,
  isMuted,
}) => {
  return (
    <div className="position-up">
      {questionArray.map((obj) => (
        <div key={nanoid()}>
          <br />
          <h1 className="header-choice" key={obj.id}>
            {obj.quiz}{" "}
            {/* <button
              className={
                obj.choices[0].isDisable
                  ? "button-reset"
                  : "button-reset-disabled"
              }
              disabled={obj.choices[0].isDisable ? false : true}
              onClick={() => resetAnswer(obj)}
            >
              ↻
            </button> */}
          </h1>

          {obj.choices.map((choice, index) => (
            <ButtonWithSound
              className="button-choice "
              key={`${obj.id}-${choice.text}`}
              handleClick={() => handleChoiceClick(obj.id, choice.text)}
              isDisable={choice.isDisable}
              isSelected={choice.isSelected}
              isCorrect={choice.isCorrect}
              showCorrectAnswer={showCorrectAnswer}
              isMuted={isMuted}
            >
              {choice.text}
            </ButtonWithSound>
          ))}

          <br />
          <br />
          <hr />
        </div>
      ))}
    </div>
  );
};

export default MultiChoice;
