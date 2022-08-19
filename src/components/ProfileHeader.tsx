import React, {useContext, useState} from 'react';
import './CollectionHeader.css';
import './ProfileHeader.css';
import defaultPlantImg from '../assets/default-plant.jpg';
import {AppContext, AppValidActions} from "../context";
import {DeviceTypes} from "../hooks/useWindowSize";
import Modal from "./Modal";
import ChangeProfilePicture from "./ChangeProfilePicture";
import {CheckEncodedImage} from '../helpers';
import GalleryExpanded from "./GalleryExpanded";
import {CollectionView} from "./CollectionHeader";
import {SectionType} from "./CollectionInteractions";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export interface IProfileHeaderProps {
  view: CollectionView,
  plantData: PlantHeaderData
}

export interface PlantHeaderData {
  id: number,
  imageFile: string,
  name: string,
  species: string,
  followers: number
}

const ProfileHeader: React.FunctionComponent<IProfileHeaderProps> = ({view, plantData}) => {
  const {state: {deviceType, userData: {plants}, BASE_URL}, dispatch} = useContext(AppContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const isValid = CheckEncodedImage(plantData.imageFile);
  const navigate = useNavigate();

  /** Returns the content that allows the owner to change their image. */
  const onImgClickOwner = () => {
    return (
      <Modal onClose={closeModal} className='change-profile-picture-modal'>
        <ChangeProfilePicture id={plantData.id} view={SectionType.PLANT} onClose={closeModal} prevImg={plantData.imageFile} />
      </Modal>
    );
  };

  /** TODO: Expands the image. */
  const onImgClickOthers = () => {
    return (
      // TODO: Configure to use OTHERS pictures instead of 'userData.imageFile'.
      <GalleryExpanded imageFile={plantData.imageFile} onClose={closeModal} />
    );
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  /** Deletes the plant from the database. */
  const deletePlant = () => {
    const url = `${ BASE_URL }plant/${ plantData.id }`;
    axios.delete(url)
      .then((res) => {
        console.log('Successfully deleted plant.');
        let index = -1;
        for(let i = 0; i < plants.length; i++) {
          if(plants[i].id === res.data.id) {
            index = i;
            break;
          }
        }

        const newPlants = plants;
        if(index > -1) newPlants.splice(index, 1);

        // Updates the plant's collection without need for fetching the whole data or refreshing.
        dispatch({type: AppValidActions.UPDATE_PLANT_PICTURE, payload: {userData: {plants: newPlants}}});
        navigate(`/collection`, {replace: true});
      })
      .catch((e) => console.log(e));
  };

  return (
    <header className="collection-header collection-profile-header plant-profile-header">
      <div className='first-background'> </div>
      <div className='second-background'> </div>
      <div className='third-background'> </div>

      <div className='list-img-container'>
        <img src={isValid? plantData.imageFile : defaultPlantImg}
             alt={'Plant'}
             onClick={openModal}
        />
      </div>

      <h2>{plantData.name.charAt(0).toUpperCase() + plantData.name.substring(1)}</h2>
      <p className='species'>Species: {plantData.species.charAt(0).toUpperCase() + plantData.species.substring(1)}</p>

      {
        // Shows the friend request button in the header in mobile devices.
        deviceType === DeviceTypes.MOBILE && view === CollectionView.OTHERS?
          <button className='button-open-section collection-header-button'>Follow</button>
          :
          ''
      }

      {
        // Sets the correct options to show for owner/others viewing the collection.
        view === CollectionView.OTHERS?
          <div className='controls'><span>Followers: ({plantData.followers})</span></div>
          :
          <div className='controls'>
            <span className='delete-control' onClick={deletePlant}>Delete</span>
            <span>Followers: ({plantData.followers})</span>
          </div>
      }

      {
        modalIsOpen?
          <>{view === CollectionView.OWNER? onImgClickOwner() : onImgClickOthers()}</>
          :
          ''
      }
    </header>
  );
}

export default ProfileHeader;