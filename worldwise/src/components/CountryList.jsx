/* eslint-disable react/prop-types */

import { Outlet } from 'react-router-dom'
import CountryItem from './CountryItem'
import styles from './CountryList.module.css'

import { useCities } from '../contexts/CitiesContext'
import Message from "./Message"
import Spinner from "./Spinner"


export default function CountryList() {
    const { isLoading, cities } = useCities();
    if (isLoading) return <Spinner />

    if (!cities.length) return <Message message="Add your first city by clicking on a city on the map" />

    const countries = cities.reduce((arr, city) => {
        if (!arr.map(el => el.country).includes(city.country)) {
            return [...arr, {
                country: city.country,
                emoji: city.emoji
            }]
        }
        else return arr
    }, [])

    return (
        <>
            <ul className={ styles.countryList }>
                {
                    countries.map((country) => <CountryItem key={ country.country } country={ country } />)
                }
            </ul>
            <Outlet />
        </>
    )
}
