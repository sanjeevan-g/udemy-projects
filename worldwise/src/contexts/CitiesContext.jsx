/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost:4200";

const CitiesContext = createContext();

function CitiesProvider({ children }) {

    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity, setCurrentCity] = useState({})


    useEffect(() => {
        async function fetchCities() {
            try {
                setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                // console.log(data)
                setCities(data);

            } catch (e) {
                console.error(`there was an error fetching cities `, e)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCities();
    }, []);

    async function getCity(id) {
        try {
            setIsLoading(true);
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            setCurrentCity(data);

        } catch (e) {
            console.error(`there was an error fetching.... `, e)
        } finally {
            setIsLoading(false)
        }
    }

    return <CitiesContext.Provider value={
        {
            cities, isLoading, getCity, currentCity
        }
    }>
        { children }
    </CitiesContext.Provider>
}

function useCities() {
    const context = useContext(CitiesContext);

    if (context === undefined) throw new Error("CitiesContext is used outside CitiesProvider");

    return context;
}

export {
    CitiesProvider, useCities
}