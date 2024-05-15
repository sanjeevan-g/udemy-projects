import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/MainDiv";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";

const initialState = {
  questions: [],
  // loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
};

async function fetchWithTimeout(url, duration = 2000) {
  return new Promise((resolve, rej) => {
    const abortController = new AbortController();

    let timerId = null;

    fetch(url, {
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        clearTimeout(timerId);
        resolve(data);
      })
      .catch((e) => {
        rej(e);
      });

    // after duration abort the fetch
    setTimeout(() => {
      abortController.abort();
    }, duration);
  });
}

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
      };
    case "newAnswer": {
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }

    default:
      throw new Error("action unknown");
  }
}

function App() {
  const [{ status, questions, index, answer }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestions = questions.length;

  useEffect(() => {
    fetchWithTimeout("http://localhost:3005/questions")
      // .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "dataReceived",
          payload: data,
        });
      })
      .catch((err) => {
        console.log("error", err);
        dispatch({
          type: "dataFailed",
        });
      });
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <Question
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
