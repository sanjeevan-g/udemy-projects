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
  const { status } = useQuiz();


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
            <Question />
            <Footer>
              <Timer  />
              <NextButton />
            </Footer>
          </>
        ) }
        { status === "finished" && (
          <FinishedScreen
          />
        ) }
      </Main>
    </div>
  );
}

export default App;
