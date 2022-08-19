import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import './NewProfile.css';
import './Location.css';
import Calendar from "./Calendar";
import {useGeolocated} from "react-geolocated";
import mapImg from "../assets/map-gray.png";
import {CheckEncodedImage, mapCoordsToImage} from "../helpers";
import InputImage from "./InputImage";
import defaultPlantImg from "../assets/default-plant.jpg";
import {AppContext, AppValidActions} from "../context";
import axios from "axios";
import Filters from "./Filters";

export interface INewProfileProps {
  onClose: () => void
}

const NewProfile: React.FunctionComponent<INewProfileProps> = ({onClose}) => {
  const {state: {userData: {userId}, BASE_URL, categoryIdMap}, dispatch} = useContext(AppContext);
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [basicData, setBasicData] = useState({
    name: '',
    age: 0.0,
    species: ''
  });
  const [locationCoords, setLocationCoords] = useState({
    altitude: {meters: 0.0, updated: false},
    latitude: {meters: 0.0, updated: false},
    longitude: {meters: 0.0, updated: false}
  });
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [newImage, setNewImage] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [highlightName, setHighlightName] = useState(false);
  const [highlightCategory, setHighlightCategory] = useState(false);
  const [highlightLatitude, setHighlightLatitude] = useState(false);
  const [highlightAltitude, setHighlightAltitude] = useState(false);
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
  };

  /** Updates the typed values. */
  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setBasicData(prevState => {
      return {...prevState, name: e.target.value}
    });

    setHighlightName(false);
  };

  const handleChangeAge = (e: ChangeEvent<HTMLInputElement>) => {
    const age = parseFloat(e.target.value || '0');
    setBasicData(prevState => {
      return {...prevState, age: age}
    });
  };

  const handleChangeSpecies = (e: ChangeEvent<HTMLInputElement>) => {
    setBasicData(prevState => {
      return {...prevState, species: e.target.value}
    });
  };

  const handleSelectCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.selectedOptions[0].id);
    setCategory(categoryId);
    setHighlightCategory(false);
  };

  const handleChangeAltitude = (e: ChangeEvent<HTMLInputElement>) => {
    const meters = parseFloat(e.target.value || '0');
    setLocationCoords(prevState => {
      return {...prevState, altitude: {meters: meters, updated: true}}
    });

    setHighlightAltitude(false);
  };

  const handleChangeLatitude = (e: ChangeEvent<HTMLInputElement>) => {
    const meters = parseFloat(e.target.value || '0');
    setLocationCoords(prevState => {
      return {...prevState, latitude: {meters: meters, updated: true}}
    });

    setHighlightLatitude(false);
  };

  const handleChangeLongitude = (e: ChangeEvent<HTMLInputElement>) => {
    const meters = parseFloat(e.target.value || '0');
    setLocationCoords(prevState => {
      return {...prevState, longitude: {meters: meters, updated: true}}
    });
  };

  /** Validates that the required fields are filled. Returns true if button should be disabled. */
  const validateFields = () => {
    return basicData.name === '' || category === undefined || !locationCoords.altitude.updated || !locationCoords.latitude.updated;
  };

  /** Highlights the missing values. */
  const showHints = () => {
    basicData.name === ''? setHighlightName(true) : setHighlightName(false);
    category === undefined? setHighlightCategory(true) : setHighlightCategory(false);
    locationCoords.altitude.updated? setHighlightAltitude(false) : setHighlightAltitude(true);
    locationCoords.latitude.updated? setHighlightLatitude(false) : setHighlightLatitude(true);
  };

  /** Saves the new plant into the database. */
  const createPlant = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const url = `${ BASE_URL }plant`;
    const data = {
      name: basicData.name,
      species: basicData.species,
      schedule: selectedDates.join(','),
      caringInfo: "plant", // TODO: Confirm what this means
      location: `${locationCoords.latitude.meters},${locationCoords.longitude.meters},${locationCoords.altitude.meters}`,
      ownerId: userId,
      plantsCategoryId: category,
      initialAge: basicData.age,
      imageFile: CheckEncodedImage(newImage)? newImage : ''
    };

    axios.post(url, data)
      .then((res) => {
        console.log('Successfully created plant');
        console.log(res.data);
        dispatch({type: AppValidActions.CREATE_NEW_PLANT, payload: {newPlant: res.data}});
        onClose();
      })
      .catch((e) => console.log(e))
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

      <div className='section-divisor'> </div>

      <h5>Basic data:</h5>
      <label>
        <span>Plant's name:</span>
        <input className={`input-section ${highlightName? 'invalid-input' : ''}`}
               type='text'
               value={basicData.name}
               onChange={(e) => handleChangeName(e)}
        />
        <div className='required-mark input-mark'> </div>
      </label>
      <label>
        <span>Plant's age (years):</span>
        <input className='input-section'
               type='number'
               step={0.1}
               min={0}
               value={basicData.age}
               onChange={(e) => handleChangeAge(e)}
        />
        <div className='optional-mark input-mark'> </div>
      </label>
      <label>
        <span>Species:</span>
        <input className='input-section'
               type='text'
               placeholder='Scientific or popular name'
               value={basicData.species}
               onChange={(e) => handleChangeSpecies(e)}
        />
        <div className='optional-mark input-mark'> </div>
      </label>

      <div className='section-divisor'> </div>

      <div className='new-profile-field'>
        <h5>Plant's category: <div className='required-mark input-mark'> </div></h5>
        <select defaultValue={-1}
                onChange={(e) => handleSelectCategory(e)}
                className={highlightCategory? 'invalid-select-input' : ''}
        >
          <option value={-1} disabled>Select plant Category</option>
          {
            Object.entries(categoryIdMap).map((item, index) => {
              return (
                <option id={`${item[1]}`} key={`plant-profile-option-cat-${item[1]}`}>
                  {item[0].charAt(0).toUpperCase() + item[0].substring(1)}
                </option>
              );
            })
          }
        </select>

        { Object.entries(categoryIdMap).length === 0? <div className='hidden-filters'><Filters/></div> : '' }
      </div>

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
          <input className={`input-section ${highlightAltitude? 'invalid-input' : ''}`}
                 type='number'
                 value={locationCoords.altitude.meters}
                 onChange={(e) => handleChangeAltitude(e)}
          />
          <div className='required-mark input-mark'> </div>
        </label>

        <label>
          <span>Latitude (m):</span>
          <input  className={`input-section ${highlightLatitude? 'invalid-input' : ''}`}
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
          <button onClick={calculateLocation} className={`button-action ${isGeolocationAvailable && isGeolocationEnabled && coords? '' : 'disabled-button'}`}>
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

      {
        highlightName || highlightLatitude || highlightAltitude?
          <p className='error-message'>Error: Fill the missing required data</p>
          :
          ''
      }

      <div className='modal-list-buttons'>
        <button className='button-action' onClick={onClose}> Cancel </button>
        <button className={`button-action ${validateFields()? 'disabled-button' : ''}`}
                onClick={validateFields()? showHints : (e) => createPlant(e)}
        >
          Create profile
        </button>
      </div>
    </div>
  );
}

export default NewProfile;