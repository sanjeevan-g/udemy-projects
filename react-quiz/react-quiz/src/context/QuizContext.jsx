/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();



const initialState = {
    questions: [],
    // loading, error, ready, active, finished
    status: "loading",
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
    secondsRemaining: 0,
};

const sec_per_question = 30;

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
                secondsRemaining: state.questions.length * sec_per_question,
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

        case "nextQuestion": {
            return {
                ...state,
                index: state.index + 1,
                answer: null, // reset
            };
        }

        case "finish": {
            return {
                ...state,
                status: "finished",
                highscore: Math.max(state.highscore, state.points),
            };
        }

        case "restart": {
            return {
                ...state,
                status: "ready",
                index: 0,
                answer: null,
                points: 0,
            };
        }

        case "tick": {
            return {
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                status: state.secondsRemaining == 0 ? "finished" : state.status,
            };
        }

        default:
            throw new Error("action unknown");
    }
}



export function QuizProvider({ children }) {

    const [
        { status, questions, index, answer, points, highscore, secondsRemaining },
        dispatch,
    ] = useReducer(reducer, initialState);


    const numQuestions = questions.length;

    const maxPossiblePoints = questions.reduce(
        (prev, cur) => prev + cur.points,
        0
    );

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

    return <QuizContext.Provider value={
        { status, questions, index, answer, points, highscore, secondsRemaining, dispatch, numQuestions, maxPossiblePoints }
    }>
        {
            children
        }
    </QuizContext.Provider>
}

export const useQuiz = () => {
    const context = useContext(QuizContext);

    if (context === undefined) throw new Error("QuizContext is used outside QuizProvider");

    return context;
}