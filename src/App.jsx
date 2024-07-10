import { decode } from "html-entities";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import ClipLoader from "react-spinners/ClipLoader";
import "./App.css";
import sampleArray from "./assets/sampleArray";
import Form from "./components/Form";
import MultiChoice from "./components/MultiChoice";
import unmuteImage from "/mute-off.svg";
import muteImage from "/mute-on.svg";

function App() {
  const [isNewGame, setIsNewGame] = useState(true);
  const [questionArray, setQuestionArray] = useState([]);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isEndGame, setIsEndGame] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [formData, setFormData] = useState({
    trivia_category: "9",
    trivia_difficulty: "easy",
    trivia_number_question: "5",
  });

  const url = `https://opentdb.com/api.php?amount=${formData.trivia_number_question}&category=${formData.trivia_category}&difficulty=${formData.trivia_difficulty}&type=multiple`;

  const toggleMute = () => {
    setIsMuted((prevIsMuted) => !prevIsMuted);
  };

  useEffect(() => {
    newGameSound.current.muted = isMuted;
    selectSound.current.muted = isMuted;
  }, [isMuted]);

  const newGameSound = useRef(new Audio("/new_game_sound.wav"));
  const selectSound = useRef(new Audio("/select_sound.wav"));

  const fetchData = async (url) => {
    let timeoutId;
    try {
      console.log("fetch!");
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.results);
      setQuestionArray(shuffleArray(data.results));
      setTotalScore(data.results.length);

      if ((await data.results.length) == formData.trivia_number_question) {
        console.log("data length:", data.results.length);
        console.log("num question: ", formData.trivia_number_question);
        clearTimeout(timeoutId);
        setIsReady(true);
      } else {
        setIsReady(false);
      }
    } catch (error) {
      //console.error(error);
      if (!isReady) {
        timeoutId = setTimeout(() => {
          fetchData(url);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    fetchData(url);
  }, [formData, isNewGame]);

  const shuffleArray = (originalArray) => {
    const newArray = [];
    let newObj = {};

    originalArray.map((obj) => {
      const randomIndex = Math.floor(
        Math.random() * (obj.incorrect_answers.length + 1)
      );

      // create new object with all new key
      // deep copy will not affect the original object
      newObj = {
        id: nanoid(),
        quiz: decode(JSON.parse(JSON.stringify(obj.question))),
        answer: decode(JSON.parse(JSON.stringify(obj.correct_answer))),
        choices: decode(JSON.parse(JSON.stringify(obj.incorrect_answers))),
      };

      // insert correct answer at random index in choices array
      newObj.choices.splice(
        randomIndex,
        0,
        JSON.parse(JSON.stringify(obj.correct_answer))
      );

      // map to each choice in the choices array and create new object with isSelected key
      newObj.choices = newObj.choices.map((choice) => {
        return {
          text: choice,
          isSelected: false,
          isDisable: false,
          isCorrect: false,
        };
      });

      // console.log(newObj);
      newArray.push(newObj);
    });

    // console.log(newArray);
    return newArray;
  };

  const playNewGameSound = () => {
    newGameSound.current.volume = 0.5;
    newGameSound.current.play();
  };

  const playSelectSound = () => {
    selectSound.current.volume = 0.25;
    selectSound.current.play();
  };

  const handleChoiceClick = (id, choiceText) => {
    // console.log(choiceText);
    // console.log(id);
    setQuestionArray((prevQuestionArray) => {
      // loop through each object in the prevQuestionArray
      return prevQuestionArray.map((prevObj) => {
        return prevObj.id === id
          ? {
              ...prevObj,
              choices: checkSelectedChoice(prevObj.choices, choiceText),
            }
          : prevObj;
      });
    });
  };

  const resetAnswer = (obj) => {
    playSelectSound();
    setQuestionArray((prevQuestionArray) => {
      // loop through each object in the prevQuestionArray
      return prevQuestionArray.map((prevObj) => {
        return prevObj.id === obj.id
          ? {
              ...prevObj,
              choices: resetSelectedChoice(prevObj),
            }
          : prevObj;
      });
    });
  };

  const checkSelectedChoice = (choiceArray, choiceText) => {
    let newChoiceArray = [];
    // console.log(choiceArray);

    for (let i = 0; i < choiceArray.length; i++) {
      // logic to select only 1 choice
      if (choiceArray[i].text === choiceText) {
        // select and unselect the choice
        choiceArray[i].isSelected = !choiceArray[i].isSelected;
      } else {
        // the other choices will be unselected
        choiceArray[i].isSelected = false;
      }

      //choiceArray[i].isDisable = true;
      newChoiceArray.push(choiceArray[i]);
    }
    return newChoiceArray;
  };

  const resetSelectedChoice = (prevObj) => {
    let newChoiceArray = [];

    if (prevObj.choices[0].isDisable == true) {
      setScore(0);
    }

    let choiceArray = prevObj.choices;

    for (let i = 0; i < choiceArray.length; i++) {
      choiceArray[i].isSelected = false;
      choiceArray[i].isDisable = false;
      newChoiceArray.push(choiceArray[i]);
    }

    return newChoiceArray;
  };

  useEffect(() => {
    //console.log(questionArray);
    const updatedScore = questionArray.map((obj) => {
      return obj.choices.reduce((acc, choice) => {
        if (choice.isSelected && choice.text === obj.answer) {
          return acc + 1;
        } else {
          return acc;
        }
      }, 0);
    });

    //console.log(`updatedScore Array: ${updatedScore}`);
    setScore(updatedScore.reduce((acc, curr) => acc + curr, 0));

    //console.log("score: ", score);
  }, [questionArray]);

  useEffect(() => {
    //console.log("Updated score: ", score);
  }, [score]);

  useEffect(() => {
    if (showCorrectAnswer) {
      setQuestionArray((prevQuestionArray) => {
        return prevQuestionArray.map((prevObj) => {
          return {
            ...prevObj,
            choices: prevObj.choices.map((choice) => {
              return choice.text === prevObj.answer
                ? { ...choice, isCorrect: true }
                : choice;
            }),
          };
        });
      });
    }
  }, [showCorrectAnswer]);

  const startGame = () => {
    playNewGameSound();
    setScore(0);
    setIsNewGame(false);
  };

  const endGame = () => {
    playNewGameSound();
    setIsEndGame(true);
    setShowCorrectAnswer((prev) => !prev);
  };

  const restartGame = () => {
    playNewGameSound();
    setScore(0);
    setIsEndGame(false);
    setIsNewGame(true);
    setIsReady(false);
    setShowCorrectAnswer(false);
  };

  function handleFormChange(event) {
    //console.log(event);
    setIsReady(false);
    console.log(formData);
    const { name, value, type, checked } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  return isNewGame ? (
    <main className="new-game ">
      <button
        onClick={toggleMute}
        style={{
          background: `url(${
            isMuted ? muteImage : unmuteImage
          }) no-repeat center/cover`,
          width: "50px",
          height: "50px",
          border: "none",
          outline: "none",
        }}
        className="button-mute"
      ></button>
      <h1>Facts Game</h1>
      <p className="p-new-game">
        This is a facts game with 4 multiple choices. Choose one correct answer.
      </p>

      <Form formData={formData} handleFormChange={handleFormChange} />

      {isReady ? (
        <button className="button-new-game" onClick={startGame}>
          Start Game
        </button>
      ) : (
        <>
          <p className="error-fetch">fetching question, please wait...</p>
          <BeatLoader className="loader" color="#D55E64" />
        </>
      )}
    </main>
  ) : (
    <>
      <main className="start-game">
        <button
          onClick={toggleMute}
          style={{
            background: `url(${
              isMuted ? muteImage : unmuteImage
            }) no-repeat center/cover`,
            width: "50px",
            height: "50px",
            border: "none",
            outline: "none",
          }}
          className="button-mute"
        ></button>
        <MultiChoice
          className="multi-choice"
          fetchURL={url}
          questionArray={questionArray}
          handleChoiceClick={handleChoiceClick}
          resetAnswer={resetAnswer}
          showCorrectAnswer={showCorrectAnswer}
          isMuted={isMuted}
        />
        <button className="button-calculate" onClick={endGame}>
          Calculate Score
        </button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button className="button-restart" onClick={restartGame}>
          Restart Game
        </button>
        {isEndGame ? (
          <h1 className="total-score">
            Total Score: {`${score}/${totalScore}`}
          </h1>
        ) : (
          <></>
        )}
      </main>
      <div className="p-music">
        <strong>Music:</strong> Lend a Hand - By Ryan James Carr
      </div>
    </>
  );
}

export default App;
