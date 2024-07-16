/* eslint-disable react/prop-types */

import { Link } from 'react-router-dom';
import styles from './CityItem.module.css'
import { useCities } from '../contexts/CitiesContext';

const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));

export default function CityItem({ city }) {

    /* 
    
            "cityName": "Lisbon",
        "country": "Portugal",
        "emoji": "🇵🇹",
        "date": "2027-10-31T15:59:59.138Z",
        "notes": "My favorite city so far!",
        "position": {
            "lat": 38.727881642324164,
            "lng": -9.140900099907554
        },
        "id"*/
    const { cityName, emoji, date,id, position } = city;
    const {currentCity, deleteCity} = useCities();
    // console.log(currentCity);

    function handleDelete(e) {
        e.preventDefault();
        deleteCity(id)
    }
    return (
        <li >
            <Link className={ `${styles.cityItem} ${ currentCity.id === id ? `${styles['cityItem--active']}` : '' }` } to={`${id}?lat=${position.lat}&lng=${position.lng}`} >
                <span className={ styles.emoji }>
                    <img src={`https://flagcdn.com/24x18/${emoji.toLowerCase()}.png`} alt="" />
                </span>
                <h3 className={ styles.name }>{ cityName }</h3>
                <time className={ styles.date }>({ formatDate(date) })</time>
                <button onClick={handleDelete } className={ styles.deleteBtn }>&times;</button>
            </Link>
        </li>
    )
}
