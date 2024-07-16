/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useCities } from '../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Button from './Button';
import styles from './Map.module.css';

export default function Map() {


  const { cities } = useCities();

  const [mapPosition, setMapPosition] = useState([40, 0]);

  const { position: geolocationPosition,
    isLoading: isLoadingPosition,
    getPosition: getGeolocationPosition
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng])

  useEffect(() => {
    if (geolocationPosition) setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition])

  return (
    <div className={ styles.mapContainer }>
      { !geolocationPosition && <Button type="position" onClick={ getGeolocationPosition }>
        {
          isLoadingPosition ? "Loading..." : "use current position"
        }
      </Button> }
      <MapContainer className={ styles.map } center={ mapPosition } zoom={ 6 } scrollWheelZoom={ true }>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
        />
        { cities.map(city => (
          <Marker position={ [city.position.lat, city.position.lng] } key={ city.id }>
            <Popup>
              <span>{ city.emoji }</span>
              <span>{ city.cityName }</span>
            </Popup>
          </Marker>
        ))
        }
        <ChangeCenter position={ mapPosition } />
        <DetectClick />
      </MapContainer>
    </div>
  )
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);

  return null;
}

function DetectClick() {


  const navigate = useNavigate()

  useMapEvents({
    click: (e) => {
      // console.log(e.latlng.lat, e.latlng.lng)
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    }
  })

  return null;
}
