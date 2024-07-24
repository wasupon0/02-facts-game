# FactsGame

_Choose Your Challenge, Master Your Knowledge!_
<br/><br/>
![hero](./public/readme-img-01.png)
<br/>

## Overview

FactsGame is an interactive platform where players can test their knowledge through multiple-choice challenges.
<br/><br/>

## Tech Stack

![diagram](./public/project-02-filled.png)

### Front-End

- Built with React for dynamic component rendering and ensures an interactive and responsive user interface.
- It uses useState hook to manage the game state, such as current questions, user answers, and score tracking, ensuring real-time updates and interactivity.
- When handles data fetching from the API. It uses useEffect hook to update the game state when new questions are retrieved, and manages other side effects like playing sounds when the user interacts with the game.
- Utilizes Vite for fast build performance and optimized development.
- Integrates sound and music for enhanced user engagement and immersive gaming experience.

### Public API

- Leverages Open Trivia Database for fetching trivia questions.
- Retrieves data via GET requests. Allows customization with parameters: amount (number of questions), category, and difficulty.
- Dynamically generates quiz content for a diverse and challenging user experience.

<br/><br/>

## Features

### Select Question Feature

https://github.com/user-attachments/assets/771d8af9-e7ae-458c-af4a-f435538b13d2

Before you start the game, you can select the type of questions. You can choose from a variety of categories, with 3 difficulty levels (easy, medium, hard), and number up to 50 questions.
<br/><br/>

---

### Game Play Feature

![project-02-play-note-hover](./src/assets/img/project-02-play-note-hover.png)

Once you start the game, the timer will start counting down. You will be given a number of questions with 4 multiple choice answers. Choose 1 correct answer within the time limit.

If the time runs out before you click the Send button, it is Game Over.

![project-02-gameover](./src/assets/img/project-02-gameover.png)

To see correct answer and the score you got, click the Send button at the bottom of the page.
<br/><br/>

---

### Calculate Score Feature

![project-02-score-note](./src/assets/img/project-02-score-note.png)

After you click the Send button, you will see the correct answer for each question. The correct answer will be highlighted in green. If you choose wrong answer, it will be highlighted in red.

At the bottom of the page, you will see the high score of all your game plays. Total score is the score of your current game. Best time is the time left when you finish the game. The faster you finish the game, the higher the best time will be.

Click Restart Game button will go to first page and selecting type of questions to play again.
<br/><br/>

---

### Demo

https://github.com/user-attachments/assets/806e2fbe-260b-4d93-a6d6-851877f4ea5f

Let's see a demo game! Try turn on music ♫
