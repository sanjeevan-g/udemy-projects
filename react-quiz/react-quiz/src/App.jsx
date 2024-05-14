import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";

const initialState = {
  questions: [],
  // loading, error, ready, finished
  status: "loading",
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

    default:
      throw new Error("action unknown");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

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
        <p>{state.status}</p>
        <p>1/15</p>
        <p>Questions ?</p>
      </Main>
    </div>
  );
}

export default App;
