import AbortController from "abort-controller";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import { BeatLoader } from "react-spinners";
import "./App.css";
import sampleArray from "./assets/sampleArray";
import Confetti from "./components/Confetti";
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
    gameMusic.current.muted = isMuted;
    endgameMusic.current.muted = isMuted;
  }, [isMuted]);

  const newGameSound = useRef(new Audio("/new_game_sound.wav"));
  const selectSound = useRef(new Audio("/select_sound.wav"));

  const controller = new AbortController();
  const signal = controller.signal;

  function decode(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    //console.log(txt.value);
    return txt.value;
  }

  const fetchData = async (url) => {
    let timeoutId;
    try {
      console.log("fetch!");
      if (!isReady) {
        const response = await fetch(url);

        if (response.status !== 200) {
          setTimeout(() => {
            fetchData(url);
          }, 1000);
        } else if (response.status === 200) {
          const data = await response.json();
          setIsReady(true);

          console.log(data.results);
          console.log("data length:", data.results.length);
          console.log("num question: ", formData.trivia_number_question);
          setQuestionArray(shuffleArray(data.results));
          setTotalScore(data.results.length);
        }
      }
    } catch (e) {
      if (e instanceof Error) console.log(e.stack);
    }
  };

  useEffect(() => {
    console.log("useEffect fetch");
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
        choices: decode(
          JSON.parse(JSON.stringify(obj.incorrect_answers))
        ).split(","),
      };
      //console.log(newObj);

      // insert correct answer at random index in choices array
      newObj.choices.splice(
        randomIndex,
        0,
        decode(JSON.parse(JSON.stringify(obj.correct_answer)))
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

  const gameMusic = useRef(new Audio("/game_music.mp3"));
  const endgameMusic = useRef(new Audio("/endgame_music.mp3"));

  const playGameMusic = () => {
    gameMusic.current.volume = 0.015;
    gameMusic.current.loop = true;
    gameMusic.current.play();
  };

  const stopGameMusic = () => {
    gameMusic.current.volume = 0.015;
    gameMusic.current.pause();
    gameMusic.current.currentTime = 0; // Reset playback position
  };

  const playEndGameMusic = () => {
    endgameMusic.current.volume = 0.015;
    endgameMusic.current.play();
  };

  const stopEndGameMusic = () => {
    endgameMusic.current.volume = 0.015;
    endgameMusic.current.pause();
    endgameMusic.current.currentTime = 0; // Reset playback position
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
    playGameMusic();

    playNewGameSound();

    setScore(0);
    setIsNewGame(false);
  };

  const endGame = () => {
    stopGameMusic();
    playEndGameMusic();
    playNewGameSound();
    setIsEndGame(true);
    setShowCorrectAnswer((prev) => !prev);
  };

  const restartGame = () => {
    stopGameMusic();
    stopEndGameMusic();
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
          formData={formData}
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
          <>
            <h1 className="total-score">
              Total Score: {`${score}/${totalScore}`}
            </h1>
            <Confetti />
          </>
        ) : (
          <></>
        )}
      </main>
      <div className="p-music">
        <strong>Music 1:</strong> Lend a Hand - By Ryan James Carr
        <br />
        <strong>Music 2:</strong> What I Want - By PØW
      </div>
    </>
  );
}

export default App;
