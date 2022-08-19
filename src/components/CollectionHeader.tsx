import React, {useContext, useEffect, useState} from 'react';
import './CollectionHeader.css';
import defaultPersonImg from '../assets/default-person.jpeg';
import {AppContext, AppValidActions, UserData} from "../context";
import {DeviceTypes} from "../hooks/useWindowSize";
import Modal from "./Modal";
import ChangeProfilePicture from "./ChangeProfilePicture";
import {CheckEncodedImage} from '../helpers';
import GalleryExpanded from "./GalleryExpanded";
import {SectionType} from "./CollectionInteractions";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export interface ICollectionHeaderProps {
  view: CollectionView,
  othersData?: UserData
}

export enum CollectionView {
  OWNER = 'OWNER',
  OTHERS = 'OTHERS'
}

const CollectionHeader: React.FunctionComponent<ICollectionHeaderProps> = ({view, othersData}) => {
  const {state: {userData, deviceType, BASE_URL}, dispatch} = useContext(AppContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ownerData, setOwnerData] = useState<UserData>(userData);
  const [disableButton, setDisableButton] = useState(false);
  const [alreadyFriends, setAlreadyFriends] = useState(false);
  const isValid = CheckEncodedImage(view === CollectionView.OWNER? userData.imageFile : othersData?.imageFile || '');
  const navigate = useNavigate();

  /** Initializes with the correct owner data. */
  useEffect(() => {
    if(view === CollectionView.OTHERS && othersData) setOwnerData(othersData);
    else setOwnerData(userData);
  }, [userData, othersData, view]);

  /** Returns the content that allows the owner to change their image. */
  const onImgClickOwner = () => {
    return (
      <Modal onClose={closeModal} className='change-profile-picture-modal'>
        <ChangeProfilePicture id={userData.userId} view={SectionType.PERSON} onClose={closeModal} prevImg={userData.imageFile} />
      </Modal>
    );
  };

  /** Expands the image for others to view it. */
  const onImgClickOthers = () => {
    return (
      <GalleryExpanded imageFile={othersData?.imageFile || ''} onClose={closeModal} />
    );
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  /** For others view, enables asking for being friends. */
  const sendFriendRequest = () => {
    setDisableButton(true);
    const url = `${ BASE_URL }follow-friend`;
    const data = {
      followerId: userData.userId,
      followeeId: othersData?.userId || 0
    };

    axios.post(url, data)
      .then((res) => {
        console.log('Successfully following user');
        setDisableButton(false);
        setAlreadyFriends(true);
      })
      .catch((e) => {
        console.log(e);
        setDisableButton(false);
      });
  };

  /** Deletes the owner from the database. */
  const deleteOwner = () => {
    const url = `${ BASE_URL }user/${ userData.userId }`;
    axios.delete(url)
      .then((res) => {
        console.log('Successfully deleted Owner.');
        dispatch({type: AppValidActions.DELETE_OWNER});
        navigate(`/home`, {replace: true});
      })
      .catch((e) => console.log(e));
  };

  return (
    <header className="collection-header collection-profile-header">
      <div className='first-background'> </div>
      <div className='second-background'> </div>
      <div className='third-background'> </div>

      <div className='list-img-container'>
        <img src={isValid? ownerData.imageFile : defaultPersonImg}
             alt={'Profile owner'}
             onClick={openModal}
        />
      </div>

      <h2>{ownerData.name.charAt(0).toUpperCase() + ownerData.name.substring(1)}</h2>

      {
        // Shows the friend request button in the header in mobile devices.
        deviceType === DeviceTypes.MOBILE && view === CollectionView.OTHERS && !alreadyFriends?
          <button className='button-open-section collection-header-button'
                  onClick={sendFriendRequest}
                  disabled={disableButton}
          >
            Friend request
          </button>
          :
          ''
      }

      <div className='collection-overview'>
        <h4>Overview</h4>
        <p>Total: <span>{ownerData.count.totalPlants} Plants</span></p>
        <p>
          Experience:
          <span className='star-container'>
            {
              [...Array(5)].map((item, index) => {
                return (
                  <span className={`star ${index < ownerData.experience? 'filled' : ''}`} key={`star-rating-${index}`} />
                );
              })
            }
          </span>
        </p>
        <p>Planter: <span>{ownerData.typePlanter.charAt(0).toUpperCase() + ownerData.typePlanter.substring(1)}</span></p>
        <p>Badges: <span>{ownerData.totalBadges}</span></p>
      </div>

      {
        // Sets the correct options to show for owner/others viewing the collection.
        view === CollectionView.OTHERS?
          ''
          :
          <div className='controls'>
            <span className='delete-control' onClick={deleteOwner}>Delete</span>
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

export default CollectionHeader;