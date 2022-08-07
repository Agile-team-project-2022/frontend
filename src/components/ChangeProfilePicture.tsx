import React, {useContext, useState} from 'react';
import './ChangeProfilePicture.css';
import defaultPersonImg from "../assets/example-people-1.jpeg";
import InputImage from "./InputImage";
import {AppContext} from "../context";

export interface IChangeProfilePictureProps {}

const ChangeProfilePicture: React.FunctionComponent<IChangeProfilePictureProps> = () => {
  const {state: {userData: {imageFile}}} = useContext(AppContext);
  const [newImage, setNewImage] = useState(imageFile);

  const uploadNewImage = (encodedImg: string) => {
    setNewImage(encodedImg);
  };

  // TODO: post request with new data.
  const saveImage = () => {

  };

  return (
    <div className='change-profile-picture-container'>
      <h2 className='section-title-modal'>Change profile picture - Owner</h2>

      <div className='change-profile-picture-content'>
        <div className='list-img-container change-profile-picture'>
          <img src={newImage !== ''? newImage : defaultPersonImg} alt={'Profile owner'} />
        </div>
        <InputImage onUploadImage={uploadNewImage} />
      </div>

      <button className='button-action' onClick={saveImage}> Save new image </button>
    </div>
  );
}

export default ChangeProfilePicture;