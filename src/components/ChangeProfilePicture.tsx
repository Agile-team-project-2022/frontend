import React, {useContext, useEffect, useState} from 'react';
import './ChangeProfilePicture.css';
import defaultPersonImg from "../assets/default-person.jpeg";
import InputImage from "./InputImage";
import {AppContext, AppValidActions} from "../context";
import axios from "axios";
import {CheckEncodedImage} from '../helpers';
import saveImg from '../assets/save.png';
import cancelImg from '../assets/cancel.png';
import {DeviceTypes} from "../hooks/useWindowSize";
import {SectionType} from "./CollectionInteractions";

export interface IChangeProfilePictureProps {
  onClose: () => void,
  view: SectionType,
  prevImg: string,
  id: number
}

const ChangeProfilePicture: React.FunctionComponent<IChangeProfilePictureProps> = ({onClose, view, prevImg, id}) => {
  const {state: {userData, BASE_URL, deviceType}, dispatch} = useContext(AppContext);
  const [newImage, setNewImage] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(CheckEncodedImage(newImage));
  }, [newImage]);

  const uploadNewImage = (encodedImg: string) => {
    setNewImage(encodedImg);
  };

  /** Updates the database with the new uploaded owner image only if the images differ. */
  const saveOwnerImage = () => {
    if(prevImg === newImage || !isValid) {
      onClose();
      return;
    }

    const url = `${ BASE_URL }user/${ id }`;
    const data = {
      imageFile: newImage, // TODO: Confirm changes done in backend to accept new image data.
    };

    axios.put(url, data)
      .then((response) => {
        console.log(`Successfully updated user image in database`);
        dispatch({type: AppValidActions.UPDATE_OWNER_PICTURE, payload: {userData: {imageFile: newImage}}});
        onClose();
      })
      .catch((e) => console.log(e));
  };

  /** Updates the database with the new Plant image only if the images differ. */
  const savePlantImage = () => {
    if(prevImg === newImage || !isValid) {
      onClose();
      return;
    }

    const url = `${ BASE_URL }plant/${ id }`;
    const data = {
      ownerId: userData.userId,
      plantsCategoryId: 1, // TODO: ask to remove this in updating the plant.
      imageFile: newImage,
    };

    axios.put(url, data)
      .then((response) => {
        console.log(`Successfully updated user Plant image in database`);
        let plantIndex = 0;
        for(let i = 0; i < userData.plants.length; i++) {
          if(userData.plants[i].id === id) {
            plantIndex = i;
            break;
          }
        }

        // Updates the plant's collection without need for fetching the whole data or refreshing.

        dispatch({type: AppValidActions.UPDATE_PLANT_PICTURE, payload: {plantData: {imageFile: '', plantIndex: plantIndex}}});
        onClose();
      })
      .catch((e) => console.log(e));
  };

  /** Determines the style of the curved text. */
  const getTextPathStyle = () => {
    if(deviceType === DeviceTypes.MOBILE) return 'translate(199, 118.5) scale(1)';
    else if(deviceType === DeviceTypes.TABLET) return 'translate(105.8, 57) scale(1.5)';
    else return 'translate(48, 19.5) scale(2.2)';
  };

  return (
    <div className='change-profile-picture-container'>

      <div className='curved-text-container'>
        <svg viewBox="0 0 500 500">
          <path id="curve" d="M 0 100 A 100 100 0 0 1 200 100 L 0 100 Z"
                fill="transparent"
                transform={getTextPathStyle()}
          />
          <text>
            <textPath xlinkHref="#curve" fontSize='1.35rem' fontWeight='500'>
              Change profile picture
            </textPath>
          </text>
        </svg>
      </div>

      <div className='change-profile-picture-content'>
        <InputImage onUploadImage={uploadNewImage}>
          <div className='list-img-container change-profile-picture'>
            <img src={isValid? newImage : CheckEncodedImage(prevImg)? prevImg : defaultPersonImg} alt={'Profile'} />
          </div>
        </InputImage>
      </div>

      <div className='change-profile-picture-buttons-container'>
        <button onClick={onClose}> <img src={cancelImg} alt='Cancel'/> </button>
        <button onClick={view === SectionType.PLANT? savePlantImage : saveOwnerImage}> <img src={saveImg} alt='Save'/> </button>
      </div>
    </div>
  );
}

export default ChangeProfilePicture;