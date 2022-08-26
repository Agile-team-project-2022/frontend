import React, {useContext, useEffect, useState} from 'react';
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
import deleteImg from "../assets/delete.png";

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
  const {state: {deviceType, userData: {userId, followedPlants}, BASE_URL}, dispatch} = useContext(AppContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const isValid = CheckEncodedImage(plantData.imageFile);
  const [disableButton, setDisableButton] = useState(false);
  const [alreadyFollow, setAlreadyFollow] = useState(false);
  const navigate = useNavigate();

  /** Initializes with the correct plant followers data. */
  useEffect(() => {
    if(view === CollectionView.OTHERS) {
      for(let follower of followedPlants) {
        // Disables requesting for friends more than once.
        if(follower.id === plantData.id) {
          setAlreadyFollow(true);
          break;
        }
      }
    }
  }, [followedPlants, plantData, view]);

  /** Returns the content that allows the owner to change their image. */
  const onImgClickOwner = () => {
    return (
      <Modal onClose={closeModal} className='change-profile-picture-modal'>
        <ChangeProfilePicture id={plantData.id} view={SectionType.PLANT} onClose={closeModal} prevImg={plantData.imageFile} />
      </Modal>
    );
  };

  /** Expands the image. */
  const onImgClickOthers = () => {
    return (
      <GalleryExpanded imageFile={plantData.imageFile} onClose={closeModal} />
    );
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  /** For others view, enables asking for following plant. */
  const sendFollow = () => {
    setDisableButton(true);
    const url = `${ BASE_URL }follow-plant`;
    const data = {
      userId: userId,
      plantId: plantData.id
    };

    axios.post(url, data)
      .then((res) => {
        console.log('Successfully following plant');
        setDisableButton(false);
        setAlreadyFollow(true);
      })
      .catch((e) => {
        console.log(e);
        setDisableButton(false);
      });
  };

  /** For others view, enables unfollowing. */
  const deleteFollow = () => {
    setDisableButton(true);
    const url = `${ BASE_URL }follow-plant/delete`;
    const data = {
      userId: userId,
      plantId: plantData.id
    };
    axios.put(url, data)
      .then((res) => {
        console.log('Successfully stopped following user');
        setDisableButton(false);
        setAlreadyFollow(false);
      })
      .catch((e) => {
        console.log(e);
        setDisableButton(false);
      });
  };

  /** Deletes the plant from the database. */
  const deletePlant = () => {
    setDisableButton(true);
    const url = `${ BASE_URL }plant/${ plantData.id }`;

    axios.delete(url)
      .then((res) => {
        console.log('Successfully deleted plant.');

        // Updates the plant's collection without need for fetching the whole data or refreshing.
        dispatch({type: AppValidActions.DELETE_PLANT});
        navigate(`/collection`, {replace: true});
      })
      .catch((e) => {
        console.log(e);
        setDisableButton(false);
      });
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
        view === CollectionView.OTHERS && deviceType === DeviceTypes.MOBILE?
          <button className={`${deviceType === DeviceTypes.MOBILE? 'mobile-follow-button' : ''} button-open-section collection-header-button`}
                  onClick={alreadyFollow? deleteFollow : sendFollow}
                  disabled={disableButton}
          >
            {alreadyFollow? 'Unfollow' : 'Follow'}
          </button>
          :
          ''
      }

      {
        // Sets the correct options to show for owner/others viewing the collection.
        view === CollectionView.OTHERS?
          <div className='controls'><span>Followers: ({plantData.followers})</span></div>
          :
          <div className='controls'>
            <span className={`${disableButton? 'disabled-delete-button' : ''} delete-control`} onClick={deletePlant}>
              <img src={deleteImg} alt='Delete' />
              Delete
            </span>
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