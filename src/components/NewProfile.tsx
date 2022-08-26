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

interface Coords {
  latitude: {meters: string, updated: boolean},
  longitude: {meters: string, updated: boolean}
}

const NewProfile: React.FunctionComponent<INewProfileProps> = ({onClose}) => {
  const {state: {userData: {userId}, BASE_URL, categoryIdMap}, dispatch} = useContext(AppContext);
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [basicData, setBasicData] = useState({
    name: '',
    age: 0.0,
    species: ''
  });
  const [locationCoords, setLocationCoords] = useState<Coords>({
    latitude: {meters: '', updated: false},
    longitude: {meters: '', updated: false}
  });
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [newImage, setNewImage] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [highlightName, setHighlightName] = useState(false);
  const [highlightCategory, setHighlightCategory] = useState(false);
  const [highlightLatitude, setHighlightLatitude] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [confirmSuccess, setConfirmSuccess] = useState(false);
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

  const selectDay = (day: number) => {
    setSelectedDates(prevState => {
      if(prevState.includes(day)) return prevState.filter(item => item !== day);
      else return [...prevState, day]
    });
  };

  /** Auto fills the available geolocation data. */
  const calculateLocation = () => {
    setLocationCoords({
      latitude: {
        meters: `${coords && coords.latitude? coords.latitude : 0}`,
        updated: !!coords
      },
      longitude: {
        meters: `${coords && coords.longitude? coords.longitude : 0}`,
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

  /** Formats the input numbers. Required for a smooth experience typing numbers in location fields. */
  const validateNumbers = (value: string, threshold: number) => {
    const floats = value.match(/[.]/g)?.length || 0;
    const validatedValue = floats >= 1?
      value.slice(0, value.indexOf('.') + 1).replace(/[^0-9.]/g, '')
      + value.slice(value.indexOf('.') + 1, value.length).replace(/[^0-9]/g, '')
      :
      value.replace(/[^0-9.]/g, '');
    const negative = value[0] === '-';
    if(parseFloat(`${negative? '-' : ''}${validatedValue}`) > threshold
      || parseFloat(`${negative? '-' : ''}${validatedValue}`) < -threshold) {
      return `${negative? '-' : ''}${threshold}`;
    } else {
      return `${negative? '-' : ''}${validatedValue}`;
    }
  };

  const handleChangeLatitude = (e: ChangeEvent<HTMLInputElement>) => {
    const meters = validateNumbers(e.target.value, 82);
    setLocationCoords(prevState => {
      return {...prevState, latitude: {meters: meters, updated: true}}
    });

    setHighlightLatitude(false);
  };

  const handleChangeLongitude = (e: ChangeEvent<HTMLInputElement>) => {
    const meters = validateNumbers(e.target.value, 170);
    setLocationCoords(prevState => {
      return {...prevState, longitude: {meters: meters, updated: true}}
    });
  };

  /** Validates that the required fields are filled. Returns true if button should be disabled. */
  const validateFields = () => {
    return basicData.name === '' || category === undefined || !locationCoords.latitude.updated;
  };

  /** Highlights the missing values. */
  const showHints = () => {
    basicData.name === ''? setHighlightName(true) : setHighlightName(false);
    category === undefined? setHighlightCategory(true) : setHighlightCategory(false);
    locationCoords.latitude.updated? setHighlightLatitude(false) : setHighlightLatitude(true);
  };

  /** Saves the new plant into the database. */
  const createPlant = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setDisableButton(true);
    const url = `${ BASE_URL }plant`;
    const data = {
      name: basicData.name,
      species: basicData.species,
      schedule: selectedDates.join(','),
      caringInfo: "",
      location: `${locationCoords.latitude.meters},${locationCoords.longitude.meters},${0}`,
      ownerId: userId,
      plantsCategoryId: category,
      initialAge: basicData.age,
      imageFile: CheckEncodedImage(newImage)? newImage : ''
    };

    axios.post(url, data)
      .then((res) => {
        console.log('Successfully created plant');
        dispatch({type: AppValidActions.CREATE_NEW_PLANT, payload: {newPlant: res.data}});
        showConfirmationSuccess();
        setTimeout(() => {
          setDisableButton(false);
          onClose();
        }, 3550);
      })
      .catch((e) => {
        console.log(e);
        setDisableButton(false);
      })
  };

  /** Shows a confirmation animation when the new profile is successfully created. */
  const showConfirmationSuccess = () => {
    setConfirmSuccess(true);
    setTimeout(() => {
      setConfirmSuccess(false);
    }, 3500);
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
          <span>Latitude (m):</span>
          <input  className={`input-section ${highlightLatitude? 'invalid-input' : ''}`}
                  type='text'
                  placeholder='0.0'
                  value={locationCoords.latitude.meters}
                  onChange={(e) => handleChangeLatitude(e)}
          />
          <div className='required-mark input-mark'> </div>
        </label>

        <label>
          <span>Longitude (m):</span>
          <input className='input-section'
                 type='text'
                 placeholder='0.0'
                 value={locationCoords.longitude.meters}
                 onChange={(e) => handleChangeLongitude(e)}
          />
          <div className='optional-mark input-mark'> </div>
        </label>

        <label className='calculate-coords-label-container'>
          <span>Or:</span>
          <button onClick={calculateLocation}
                  className={`button-action ${isGeolocationAvailable && isGeolocationEnabled && coords && coords.latitude && coords.longitude? '' : 'disabled-button'}`}
                  disabled={!(isGeolocationAvailable && isGeolocationEnabled && coords && coords.latitude && coords.longitude)}
          >
            Calculate automatically
          </button>
        </label>

        <p>Preview selected location:</p>
        <div className='location-container-background'>
          <img src={mapImg} alt='Global map' />
          <div className='location-marker' style={{
            top: `${mapCoordsToImage(parseFloat(locationCoords.latitude.meters || '0'), parseFloat(locationCoords.longitude.meters || '0')).latitude}%`,
            left: `${mapCoordsToImage(parseFloat(locationCoords.latitude.meters || '0'), parseFloat(locationCoords.longitude.meters || '0')).longitude}%`
          }}>
          </div>
        </div>
      </div>

      {
        highlightName || highlightLatitude?
          <p className='error-message'>Error: Fill the missing required data</p>
          :
          ''
      }

      <div className='modal-list-buttons'>
        <button className='button-action' onClick={onClose} disabled={disableButton}>
          Cancel
        </button>
        <button className={`button-action ${validateFields()? 'disabled-button' : ''}`}
                onClick={validateFields()? showHints : (e) => createPlant(e)}
                disabled={disableButton}
        >
          Create profile
        </button>
      </div>

      {
        confirmSuccess?
          <div className='success-page-container'>
            <div className="success-animation-container">
              <div className="success-animation">
                <div> </div>
                <div> </div>
              </div>
            </div>
          </div>
          :
          ''
      }
    </div>
  );
}

export default NewProfile;