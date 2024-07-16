import { useQuiz } from "../context/QuizContext";
import Options from "./Options";

/* eslint-disable react/prop-types */
export default function Question() {
  const { questions, dispatch, index, answer } = useQuiz();
  const question = questions[index]
  return (
    <div>
      <h4> { question?.question } </h4>
      <Options question={ question } answer={ answer } dispatch={ dispatch } />
    </div>
  );
}
