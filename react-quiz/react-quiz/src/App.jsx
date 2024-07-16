import Error from "./components/Error";
import FinishedScreen from "./components/FinishedScreen";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Loader from "./components/Loader";
import Main from "./components/MainDiv";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import Question from "./components/Question";
import StartScreen from "./components/StartScreen";
import Timer from "./components/Timer";
import { useQuiz } from "./context/QuizContext";

function App() {
  const { status, questions, index, answer, points, highscore, secondsRemaining, dispatch, numQuestions, maxPossiblePoints } = useQuiz();


  return (
    <div className="app">
      <Header />
      <Main>
        { status === "loading" && <Loader /> }
        { status === "error" && <Error /> }
        { status === "ready" && (
          <StartScreen />
        ) }
        { status === "active" && (
          <>
            <Progress />
            <Question
              question={ questions[index] }
              dispatch={ dispatch }
              answer={ answer }
            />
            <Footer>
              <Timer dispatch={ dispatch } secondsRemaining={ secondsRemaining } />
              <NextButton
                answer={ answer }
                dispatch={ dispatch }
                index={ index }
                numQuestions={ numQuestions }
              />
            </Footer>
          </>
        ) }
        { status === "finished" && (
          <FinishedScreen
            points={ points }
            maxPossiblePoints={ maxPossiblePoints }
            highscore={ highscore }
            dispatch={ dispatch }
          />
        ) }
      </Main>
    </div>
  );
}

export default App;
