import React, {ChangeEvent, useEffect, useState} from 'react';
import './NewProfile.css';
import './Location.css';
import Calendar from "./Calendar";
import {useGeolocated} from "react-geolocated";
import mapImg from "../assets/map-gray.png";
import {CheckEncodedImage, mapCoordsToImage} from "../helpers";
import InputImage from "./InputImage";
import {SectionType} from "./CollectionInteractions";
import defaultPlantImg from "../assets/default-plant.jpg";

export interface INewProfileProps {}

const NewProfile: React.FunctionComponent<INewProfileProps> = () => {
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [locationCoords, setLocationCoords] = useState({
    altitude: {meters: 0.0, updated: false},
    latitude: {meters: 0.0, updated: false},
    longitude: {meters: 0.0, updated: false}
  });
  const [newImage, setNewImage] = useState('');
  const [isValid, setIsValid] = useState(false);
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  useEffect(() => {
    setIsValid(CheckEncodedImage(newImage));
  }, [newImage]);

  const uploadNewImage = (encodedImg: string) => {
    setNewImage(encodedImg);
  };

  /** TODO: Decide how to manage the water schedule in backend. */
  const selectDay = (day: number) => {
    setSelectedDates(prevState => {
      if(prevState.includes(day)) return prevState.filter(item => item !== day);
      else return [...prevState, day]
    });
  };

  /** Auto fills the available geolocation data. */
  const calculateLocation = () => {
    setLocationCoords({
      altitude: {
        meters: coords?.altitude || 0,
        updated: !!coords
      },
      latitude: {
        meters: coords?.latitude || 0,
        updated: !!coords
      },
      longitude: {
        meters: coords?.longitude || 0,
        updated: !!coords
      },
    });

    console.log(coords, isGeolocationAvailable, isGeolocationEnabled )
  };

  /** Updates the typed values. */
  const handleChangeAltitude = (e: ChangeEvent<HTMLInputElement>) => {
    const meters = parseFloat(e.target.value || '0');
    setLocationCoords(prevState => {
      return {...prevState, altitude: {meters: meters, updated: true}}
    })
  };

  const handleChangeLatitude = (e: ChangeEvent<HTMLInputElement>) => {
    const meters = parseFloat(e.target.value || '0');
    setLocationCoords(prevState => {
      return {...prevState, latitude: {meters: meters, updated: true}}
    })
  };

  const handleChangeLongitude = (e: ChangeEvent<HTMLInputElement>) => {
    const meters = parseFloat(e.target.value || '0');
    setLocationCoords(prevState => {
      return {...prevState, longitude: {meters: meters, updated: true}}
    })
  };

  return (
    <div className='new-profile-container'>
      <h2 className='section-title'>Create new Plant profile</h2>

      <div className='new-profile-field new-picture'>
        <h5>Plant's picture: <div className='optional-mark input-mark'> </div></h5>
        <div className='change-profile-picture-content new-profile-image'>
          <InputImage onUploadImage={uploadNewImage}>
            <div className='list-img-container change-profile-picture'>
              <img src={isValid? newImage : defaultPlantImg} alt={'Profile'} />
            </div>
          </InputImage>
        </div>

        <div className='instructions-marks-container'>
          <span className='instruction-marks'>Required fields are marked with <div className='required-mark input-mark'> </div></span>
          <span className='instruction-marks'>Optional fields are marked with <div className='optional-mark input-mark'> </div></span>
        </div>
      </div>

      <label>
        <span>Plant's name:</span> <input className='input-section' type='text' />
        <div className='required-mark input-mark'> </div>
      </label>
      <label>
        <span>Plant's age (years):</span> <input className='input-section' type='number' step={0.1} min={0} placeholder='Example: 0.5 = half year' />
        <div className='optional-mark input-mark'> </div>
      </label>
      <label>
        <span>Species:</span> <input className='input-section' type='text' placeholder='Scientific or popular name' />
        <div className='optional-mark input-mark'> </div>
      </label>

      <div className='section-divisor'> </div>

      <div className='new-profile-field water-field'>
        <h5>Water schedule: <div className='required-mark input-mark'> </div></h5>
        <p>Define a rule for watering this plant. The rule will be automatically repeated over the next months. To define it, click on the dates when the plant needs water.</p>
        <Calendar onSelectDay={selectDay} selectedDates={selectedDates} />
      </div>

      <div className='section-divisor'> </div>

      <div className='new-profile-field location-field'>
        <h5>Location (approx.): </h5>
        <p>Tell where the plant is located (in meters). Or give access to calculate it automatically.</p>
        <label>
          <span>Altitude (m):</span>
          <input className='input-section'
                 type='number'
                 value={locationCoords.altitude.meters}
                 onChange={(e) => handleChangeAltitude(e)}
          />
          <div className='required-mark input-mark'> </div>
        </label>

        <label>
          <span>Latitude (m):</span>
          <input  className='input-section'
                  type='number'
                  value={locationCoords.latitude.meters}
                  onChange={(e) => handleChangeLatitude(e)}
          />
          <div className='required-mark input-mark'> </div>
        </label>

        <label>
          <span>Longitude (m):</span>
          <input className='input-section'
                 type='number'
                 value={locationCoords.longitude.meters}
                 onChange={(e) => handleChangeLongitude(e)}
          />
          <div className='optional-mark input-mark'> </div>
        </label>

        <label className='calculate-coords-label-container'>
          <span>Or:</span>
          <button onClick={calculateLocation} className={`button-action ${coords? '' : 'disabled-button'}`}>
            Calculate automatically
          </button>
        </label>

        <p>Preview selected location:</p>
        <div className='location-container-background'>
          <img src={mapImg} alt='Global map' />
          <div className='location-marker' style={{
            top: `${mapCoordsToImage(locationCoords.latitude.meters, locationCoords.longitude.meters).latitude}%`,
            left: `${mapCoordsToImage(locationCoords.latitude.meters, locationCoords.longitude.meters).longitude}%`
          }}>
          </div>
        </div>
      </div>

      <div className='modal-list-buttons'>
        <button className='button-action'> Cancel </button>
        <button className='button-action'> Create profile </button>
      </div>
    </div>
  );
}

export default NewProfile;