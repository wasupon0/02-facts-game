import { nanoid } from "nanoid";
import ButtonWithSound from "./ButtonWithSound";
import getCategoryName from "./getCategoryName";

const MultiChoice = ({
  fetchURL,
  formData,
  questionArray,
  handleChoiceClick,
  resetAnswer,
  showCorrectAnswer,
  isMuted,
}) => {
  return (
    <div className="position-up">
      {/* <p className="p-url">{fetchURL}</p> */}
      <br />
      <span className="span-form">
        {formData.trivia_number_question} Questions
      </span>
      <span className="span-form">
        {getCategoryName(formData.trivia_category)}
      </span>
      <span className="span-form">
        {formData.trivia_difficulty.slice(0, 1).toUpperCase() +
          formData.trivia_difficulty.slice(1)}
      </span>

      {questionArray.map((obj, index) => (
        <div key={nanoid()}>
          <br />
          <h1 className="header-choice" key={obj.id}>
            <span className="header-num">{index + 1}</span> &nbsp;&nbsp;
            {obj.quiz}
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
          <div className="button_choice_container">
            {obj.choices.map((choice, index) => (
              <ButtonWithSound
                className="button-choice"
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
          </div>
          <br />
          <br />
          <hr />
        </div>
      ))}
    </div>
  );
};

export default MultiChoice;
