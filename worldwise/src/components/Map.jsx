import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Map.module.css'

export default function Map() {
  const [searchParam, setSearchParam] = useSearchParams();

  const navigate = useNavigate()

  const lat = searchParam.get('lat');
  const lng = searchParam.get('lng');

  return (
    <div className={ styles.mapContainer } onClick={() => navigate("form")}>
      <h1>Map</h1>
      <h1>position { lat }, { lng } </h1>
      <button onClick={ (e) => { e.stopPropagation(); setSearchParam({ lat: 50, lng: 100 })} }>Change query</button>
    </div>
  )
}
