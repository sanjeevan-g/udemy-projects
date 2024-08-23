/* eslint-disable react/prop-types */
import { createContext, useCallback, useContext, useEffect, useReducer } from "react";

// const BASE_URL = "http://localhost:4200";
const BASE_URL = "https://worldwise-one-tau.vercel.app/api"

const CitiesContext = createContext();

function reducer(state, action) {
    switch (action.type) {
        case "loading": {
            return {
                ...state,
                isLoading: true
            }
        }

        case 'cities_loaded': {
            return {
                ...state,
                isLoading: false,
                cities: action.payload
            }
        }

        // for current city
        case 'city_loaded': {
            return {
                ...state,
                isLoading: false,
                currentCity: action.payload
            }
        }

        case 'city_created': {
            return {
                ...state,
                isLoading: false,
                cities: [...state.cities, action.payload],
                currentCity: action.payload
            }
        }

        case 'cities_deleted': {
            return {
                ...state,
                isLoading: false,
                currentCity: {},
                cities: state.cities.filter(city => city.id !== action.payload)
            }
        }

        case "rejected": {
            return {
                ...state,
                error: action.payload,
                isLoading: false
            }
        }
    }
}

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: ""
}


export function CitiesProvider({ children }) {

    const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(reducer, initialState)

    // const [cities, setCities] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [currentCity, setCurrentCity] = useState({})


    useEffect(() => {
        async function fetchCities() {
            dispatch({ type: "loading" });
            try {
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                dispatch({
                    type: "cities_loaded",
                    payload: data
                })

            } catch (e) {
                dispatch({
                    type: "rejected",
                    payload: "there was an error fetching cities...."
                })
            }
        }

        fetchCities();
    }, []);

    const getCity = useCallback(
        async function getCity(id) {

            // if request for same current city
            // console.log(id, currentCity.id, (id) == currentCity.id)
            if (id == currentCity.id) return;

            dispatch({ type: "loading" });
            try {
                const res = await fetch(`${BASE_URL}/cities/${id}`);
                const data = await res.json();
                dispatch({
                    type: "city_loaded",
                    payload: data
                })

            } catch (e) {
                dispatch({
                    type: "rejected",
                    payload: "there was an error fetching...."
                })
            }
        },
        [currentCity.id])

    async function createCity(newCity) {
        dispatch({ type: "loading" });
        try {

            const res = await fetch(`${BASE_URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await res.json();
            // setCities((cities) => [...cities, data]);
            dispatch({
                type: "city_created",
                payload: data
            })

        } catch (e) {
            dispatch({ type: "rejected", payload: "there was an error adding...." });
        }
    }

    async function deleteCity(cityId) {
        dispatch({ type: "loading" });
        try {

            await fetch(`${BASE_URL}/cities/${cityId}`, {
                method: 'DELETE'
            });

            dispatch({
                type: "cities_deleted",
                payload: cityId
            })

        } catch (error) {
            dispatch({ type: "rejected", payload: "there was an error deleting..." });
        }
    }

    return <CitiesContext.Provider value={
        {
            cities, isLoading, getCity, currentCity, createCity, deleteCity, error
        }
    }>
        { children }
    </CitiesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCities() {
    const context = useContext(CitiesContext);

    if (context === undefined) throw new Error("CitiesContext is used outside CitiesProvider");

    return context;
}

// export {
//     CitiesProvider
// }