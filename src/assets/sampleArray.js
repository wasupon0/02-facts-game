import { nanoid } from "nanoid";

const sampleArray = [
  {
    id: nanoid(),
    question: "Question 1",
    correct_answer: "Option 1",
    incorrect_answers: ["Option 2", "Option 3", "Option 4"],
  },
  {
    id: nanoid(),
    question: "Question 2",
    correct_answer: "Option 2",
    incorrect_answers: ["Option 1", "Option 3", "Option 4"],
  },
  {
    id: nanoid(),
    question: "Question 3",
    correct_answer: "Option 3",
    incorrect_answers: ["Option 1", "Option 2", "Option 4"],
  },
  {
    id: nanoid(),
    question: "Question 4",
    correct_answer: "Option 4",
    incorrect_answers: ["Option 1", "Option 2", "Option 3"],
  },
];

export default sampleArray;
