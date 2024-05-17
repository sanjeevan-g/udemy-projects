/* eslint-disable react/prop-types */
export default function Options({ question, dispatch, answer }) {
  // answer => options choose
  const hasAnswered = answer !== null;
  // console.log(hasAnswered);

  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${answer === index ? "answer" : ""}
          ${
            hasAnswered
              ? question.correctOption === index
                ? "correct"
                : "wrong"
              : ""
          }
          `}
          key={option}
          disabled={hasAnswered}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
