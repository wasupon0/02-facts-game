import AbortController from "abort-controller";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import sampleArray from "./assets/sampleArray";
import Confetti from "./components/Confetti";
import Form from "./components/Form";
import getCategoryName from "./components/getCategoryName";
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

  const [timeLeft, setTimeLeft] = useState(formData.trivia_number_question * 5); // Set timer based on num question
  const [isActive, setIsActive] = useState(false);

  const [bestTime, setBestTime] = useState(() => {
    // Retrieve the best time from local storage or set it to null if not found
    const savedTime = localStorage.getItem("bestTime");
    return savedTime ? parseInt(savedTime) : null;
  });

  const [highScore, setHighScore] = useState(() => {
    // Retrieve the high score from local storage or set it to null if not found
    const savedScore = localStorage.getItem("highScore");
    return savedScore ? parseInt(savedScore) : null;
  });

  const blinkClass = timeLeft < 20 ? "blink" : "";

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`; // Adding leading zero to seconds
  };

  const timerIntervalRef = useRef(null);

  useEffect(() => {
    // Clear existing interval to prevent duplicates
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (isActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerIntervalRef.current); // Clear the interval to stop the timer
            setIsActive(false);

            gameOverSound.current.volume = 0.25;
            gameOverSound.current.play();
            return 0; // Reset the timer or prevent it from going negative
          }

          if (prevTime < 23 && prevTime > 1) {
            pinchSound.current.volume = 0.25;
            pinchSound.current.play();
            stopGameMusic();
          }

          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (timeLeft === 0) {
        toast.error("Game Over, click the send button to see the score");
      }
    }

    // Cleanup interval on component unmount or before setting a new interval
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isActive]);

  const controllerRef = useRef();
  const urlRef = useRef(
    `https://opentdb.com/api.php?amount=${"5"}&category=${"9"}&difficulty=${"easy"}&type=multiple`
  );

  const toggleMute = () => {
    setIsMuted((prevIsMuted) => !prevIsMuted);
  };

  useEffect(() => {
    newGameSound.current.muted = isMuted;
    selectSound.current.muted = isMuted;
    gameMusic.current.muted = isMuted;
    endgameMusic.current.muted = isMuted;
    pinchSound.current.muted = isMuted;
    gameOverSound.current.muted = isMuted;
  }, [isMuted]);

  function decode(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    //console.log(txt.value);
    return txt.value;
  }

  const fetchData = async (url) => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    try {
      console.log("fetch!");
      if (!isReady) {
        const response = await fetch(url, { signal });

        if (response.status !== 200) {
          setTimeout(() => {
            fetchData(url);
          }, 1000); // retry fetch
        } else if (response.status === 200) {
          const data = await response.json();

          if (
            data.results.length === parseInt(formData.trivia_number_question) &&
            data.results[0].category ===
              getCategoryName(formData.trivia_category) &&
            data.results[0].difficulty === formData.trivia_difficulty
          ) {
            setQuestionArray(shuffleArray(data.results));
            setTotalScore(data.results.length);
            setIsReady(true);
            console.log(data.results);
          } else {
            alert("No question found. Please select different option.");
            setIsReady(true);
          }
        }
      }
    } catch (e) {
      if (e instanceof Error) console.log(e.stack);
    }
  };

  useEffect(() => {
    //console.log("useEffect fetch");
    urlRef.current = `https://opentdb.com/api.php?amount=${formData.trivia_number_question}&category=${formData.trivia_category}&difficulty=${formData.trivia_difficulty}&type=multiple`;

    fetchData(urlRef.current);
  }, [formData, isNewGame]);

  function handleFormChange(event) {
    //console.log(event);
    setIsReady(false);
    //console.log(formData);
    const { name, value, type, checked } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

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

  const newGameSound = useRef(new Audio("/new_game_sound.wav"));
  const selectSound = useRef(new Audio("/select_sound.wav"));

  const gameMusic = useRef(new Audio("/game_music.mp3"));
  const endgameMusic = useRef(new Audio("/endgame_music.mp3"));

  const pinchSound = useRef(new Audio("/pinch_sound.mp3"));
  const gameOverSound = useRef(new Audio("/gameover_sound.mp3"));

  const playGameMusic = () => {
    gameMusic.current.volume = 0.15;
    gameMusic.current.loop = true;
    gameMusic.current.play();
  };

  const stopGameMusic = () => {
    gameMusic.current.volume = 0.15;
    gameMusic.current.pause();
    gameMusic.current.currentTime = 0; // Reset playback position
  };

  const stopPinchMusic = () => {
    pinchSound.current.pause();
    pinchSound.current.currentTime = 0;
  };

  const playEndGameMusic = () => {
    endgameMusic.current.volume = 0.15;
    endgameMusic.current.play();
  };

  const stopEndGameMusic = () => {
    endgameMusic.current.volume = 0.15;
    endgameMusic.current.pause();
    endgameMusic.current.currentTime = 0;
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
    setIsActive(true);
    setTimeLeft(formData.trivia_number_question * 5); // Reset timer when start game
  };

  const endGame = (timeLeft) => {
    stopPinchMusic();
    stopGameMusic();
    playEndGameMusic();
    playNewGameSound();
    setIsEndGame(true);
    setShowCorrectAnswer((prev) => !prev);

    setIsActive(false);

    if (!highScore || score > highScore) {
      localStorage.setItem("highScore", score);
      setHighScore(score);
    }

    if (!bestTime || timeLeft > bestTime) {
      localStorage.setItem("bestTime", timeLeft);
      setBestTime(timeLeft);
    }
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

  return isNewGame ? (
    <div className="main-container">
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

        <h1>FactsGame</h1>
        <h2 className="h2-subtitle">
          Choose Your Challenge, Master Your Knowledge!
        </h2>
        <p className="p-new-game">
          This is a facts game with 4 multiple choices. Choose one correct
          answer.
        </p>

        <Form
          formData={formData}
          handleFormChange={handleFormChange}
          isReady={isReady}
        />

        {isReady ? (
          <>
            <button className="button-new-game" onClick={startGame}>
              Start Game
            </button>
            <br />
          </>
        ) : (
          <>
            <p className="error-fetch">fetching question, please wait...</p>
            <br />
            <BeatLoader className="loader" color="#D55E64" />
          </>
        )}
      </main>
    </div>
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
        <span className={`span-timer ${blinkClass}`}>
          Time: {formatTime(timeLeft)}
        </span>
        <MultiChoice
          className="multi-choice"
          fetchURL={urlRef.current}
          formData={formData}
          questionArray={questionArray}
          handleChoiceClick={handleChoiceClick}
          resetAnswer={resetAnswer}
          showCorrectAnswer={showCorrectAnswer}
          isMuted={isMuted}
        />
        <button className="button-calculate" onClick={() => endGame(timeLeft)}>
          Send
        </button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button className="button-restart" onClick={restartGame}>
          Restart Game
        </button>
        {isEndGame ? (
          <>
            <div className="total-score">
              <span>
                <strong>High Score:</strong>
                <br /> {highScore}
              </span>
              <span>
                <strong>Total Score:</strong> <br />
                {`${score}/${totalScore}`}
              </span>
              <span>
                <strong>Best Time:</strong> <br />
                {formatTime(bestTime)}
              </span>
            </div>
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
        <br />
        <strong>Music 3:</strong> Virtuoso - SATV Music
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={false}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="colored"
      />
    </>
  );
}

export default App;
