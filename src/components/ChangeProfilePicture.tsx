import React, {useContext, useEffect, useState} from 'react';
import './ChangeProfilePicture.css';
import defaultPersonImg from "../assets/example-people-1.jpeg";
import InputImage from "./InputImage";
import {AppContext, AppValidActions} from "../context";
import axios from "axios";
import {CheckEncodedImage} from '../helpers';

export interface IChangeProfilePictureProps {
  onClose: () => void
}

const ChangeProfilePicture: React.FunctionComponent<IChangeProfilePictureProps> = ({onClose}) => {
  const {state: {userData, BASE_URL}, dispatch} = useContext(AppContext);
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

  return (
    <div className='change-profile-picture-container'>

      <svg viewBox="0 0 500 500">
        <path id="curve" d="M 0 100 A 100 100 0 0 1 200 100 L 0 100 Z"
              fill="transparent"
              transform='translate(10, 57) scale(2.2)'
        />
        <text width="500">
          <textPath xlinkHref="#curve" fontSize='1.35rem' fontWeight='500'>
            Change profile picture
          </textPath>
        </text>
      </svg>

      <div className='change-profile-picture-content'>
        <InputImage onUploadImage={uploadNewImage}>
          <div className='list-img-container change-profile-picture'>
            <img src={isValid? newImage : defaultPersonImg} alt={'Profile owner'} />
          </div>
        </InputImage>
      </div>

      <button className='button-action' onClick={saveImage}> Save new image </button>
    </div>
  );
}

export default ChangeProfilePicture;