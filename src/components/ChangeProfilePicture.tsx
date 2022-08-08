import React, {useContext, useState} from 'react';
import './ChangeProfilePicture.css';
import defaultPersonImg from "../assets/example-people-1.jpeg";
import InputImage from "./InputImage";
import {AppContext} from "../context";
import axios from "axios";

export interface IChangeProfilePictureProps {
  onClose: () => void
}

const ChangeProfilePicture: React.FunctionComponent<IChangeProfilePictureProps> = ({onClose}) => {
  const {state: {userData, BASE_URL}} = useContext(AppContext);
  const [newImage, setNewImage] = useState(userData.imageFile);

  const uploadNewImage = (encodedImg: string) => {
    setNewImage(encodedImg);
  };

  /** Updates the database with the new uploaded owner image. */
  const saveImage = () => {
    const url = `${ BASE_URL }user/${ userData.userId }`;
    const data = {
      imageFile: newImage, // TODO: Confirm changes done in backend to accept new image data.
      name: userData.user
    };

    axios.put(url, data)
      .then((response) => {
        console.log(`Successfully updated user in database: ${data.name}`);
        onClose();
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className='change-profile-picture-container'>
      <h2 className='section-title-modal'>Change profile picture</h2>

      <div className='change-profile-picture-content'>
        <InputImage onUploadImage={uploadNewImage}>
          <div className='list-img-container change-profile-picture'>
            <img src={newImage !== ''? newImage : defaultPersonImg} alt={'Profile owner'} />
          </div>
        </InputImage>
      </div>

      <button className='button-action' onClick={saveImage}> Save new image </button>
    </div>
  );
}

export default ChangeProfilePicture;