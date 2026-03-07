// src/context/QuizContext.jsx
import { createContext } from 'react';

export const QuizContext = createContext({
  questions: [],
  answers: [],
  updateAnswer: () => {},
  submitQuiz: async () => {},
  result: null,
  resetQuiz: () => {}
});