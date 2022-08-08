import React, {useContext, useEffect, useState} from 'react';
import './ChangeProfilePicture.css';
import defaultPersonImg from "../assets/example-people-1.jpeg";
import InputImage from "./InputImage";
import {AppContext, AppValidActions} from "../context";
import axios from "axios";
import {CheckEncodedImage} from '../helpers';
import saveImg from '../assets/save.png';
import cancelImg from '../assets/cancel.png';
import {DeviceTypes} from "../hooks/useWindowSize";

export interface IChangeProfilePictureProps {
  onClose: () => void
}

const ChangeProfilePicture: React.FunctionComponent<IChangeProfilePictureProps> = ({onClose}) => {
  const {state: {userData, BASE_URL, deviceType}, dispatch} = useContext(AppContext);
  const [newImage, setNewImage] = useState(userData.imageFile);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(CheckEncodedImage(newImage));
  }, [newImage]);

  const uploadNewImage = (encodedImg: string) => {
    setNewImage(encodedImg);
  };

  /** Updates the database with the new uploaded owner image only if the images differ. */
  const saveImage = () => {
    if(userData.imageFile === newImage || !isValid) {
      onClose();
      return;
    }

    const url = `${ BASE_URL }user/${ userData.userId }`;
    const data = {
      imageFile: newImage, // TODO: Confirm changes done in backend to accept new image data. Check size constraint.
    };

    axios.put(url, data)
      .then((response) => {
        console.log(`Successfully updated user image in database: ${userData.user}`);
        dispatch({type: AppValidActions.UPDATE_OWNER_PICTURE, payload: {userData: {imageFile: newImage}}});
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
            <img src={isValid? newImage : defaultPersonImg} alt={'Profile owner'} />
          </div>
        </InputImage>
      </div>

      <div className='change-profile-picture-buttons-container'>
        <button onClick={onClose}><img src={cancelImg} alt='Cancel'/></button>
        <button onClick={saveImage}><img src={saveImg} alt='Save'/></button>
      </div>
    </div>
  );
}

export default ChangeProfilePicture;