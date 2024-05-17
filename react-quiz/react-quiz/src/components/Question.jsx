import Options from "./Options";

/* eslint-disable react/prop-types */
export default function Question({ question, dispatch, answer }) {
  return (
    <div>
      <h4> {question.question} </h4>
      <Options question={question} answer={answer} dispatch={dispatch} />
    </div>
  );
}
