import { useQuiz } from "../context/QuizContext";
import Options from "./Options";

/* eslint-disable react/prop-types */
export default function Question() {
  const { questions, index } = useQuiz();
  const question = questions.at(index);
  return (
    <div>
      <h4> { question?.question } </h4>
      <Options question={ question } />
    </div>
  );
}
