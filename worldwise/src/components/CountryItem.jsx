/* eslint-disable react/prop-types */
import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>
        <img src={`https://flagcdn.com/24x18/${country.emoji.toLowerCase()}.png` } alt="" />
      </span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
