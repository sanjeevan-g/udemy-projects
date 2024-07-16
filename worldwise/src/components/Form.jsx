// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import { useUrlPosition } from "../hooks/useUrlPosition";
import BackButton from "./BackButton";
import Button from "./Button";
import styles from "./Form.module.css";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export default function Form() {

  const [lat, lng] = useUrlPosition();

  const navigate = useNavigate()

  const { createCity, isLoading } = useCities();

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const [emoji, setEmoji] = useState("");

  const [geoCodingError, setGeoCodingError] = useState("");

  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  useEffect(() => {

    if (!lat && !lng) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true);
        setGeoCodingError("");

        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);

        const data = await res.json();

        if (!data.countryCode) {
          throw new Error("That doesn't seems to be a city, Please Click somewhere else !!")
        }

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);

        setEmoji(data.countryCode.toLowerCase());

      } catch (err) {
        console.log(err)
        setGeoCodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false)
      }
    }
    fetchCityData();
  }, [lat, lng])

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    let newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      "position": {
        lat,
        lng
      }
    }

    // console.log(newCity)
    await createCity(newCity);
    navigate("/app/cities")
  }

  if (!lat && !lng) return <Message message="Start by clicking anywhere on the map!!" />

  if (isLoadingGeocoding) return <Spinner />

  if (geoCodingError) {
    return <Message message={ geoCodingError } />
  }


  return (

    <form className={ `${styles.form} ${isLoading ? styles.loading : ''} `} onSubmit={ handleSubmit } >
      <div className={ styles.row }>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={ (e) => setCityName(e.target.value) }
          value={ cityName }
        />
        <span className={ styles.flag }>
          <img src={ `https://flagcdn.com/24x18/${emoji}.png` } alt="" />
        </span>
      </div>

      <div className={ styles.row }>
        <label htmlFor="date">When did you go to { cityName }?</label>
        {/* <input
          id="date"
          onChange={ (e) => setDate(e.target.value) }
          value={ date }
        /> */}
        <DatePicker id="date" selected={ date } onChange={ (d) => setDate(d) } dateFormat="dd/MM/yyyy" />
      </div>

      <div className={ styles.row }>
        <label htmlFor="notes">Notes about your trip to { cityName }</label>
        <textarea
          id="notes"
          onChange={ (e) => setNotes(e.target.value) }
          value={ notes }
        />
      </div>

      <div className={ styles.buttons }>

        <Button type="primary">Add</Button>
        <BackButton />

      </div>
    </form >

  );
}
