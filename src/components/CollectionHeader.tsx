import React, {useContext, useState} from 'react';
import './CollectionHeader.css';
import defaultPersonImg from '../assets/example-people-1.jpeg';
import {AppContext} from "../context";
import {DeviceTypes} from "../hooks/useWindowSize";
import Modal from "./Modal";
import ChangeProfilePicture from "./ChangeProfilePicture";
import {CheckEncodedImage} from '../helpers';
import GalleryExpanded from "./GalleryExpanded";

export interface ICollectionHeaderProps {view: CollectionView}

export enum CollectionView {
  OWNER = 'OWNER',
  OTHERS = 'OTHERS'
}

const CollectionHeader: React.FunctionComponent<ICollectionHeaderProps> = ({view}) => {
  const {state: {userData, deviceType}} = useContext(AppContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const isValid = CheckEncodedImage(userData.imageFile);

  /** Returns the content that allows the owner to change their image. */
  const onImgClickOwner = () => {
    return (
      <Modal onClose={closeModal} className='change-profile-picture-modal'>
        <ChangeProfilePicture onClose={closeModal} />
      </Modal>
    );
  };

  /** TODO: Expands the image. */
  const onImgClickOthers = () => {
    return (
      // TODO: Configure to use OTHERS pictures instead of 'userData.imageFile'.
      <GalleryExpanded imageFile={userData.imageFile} onClose={closeModal} />
    );
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <header className="collection-header collection-profile-header">
      <div className='first-background'> </div>
      <div className='second-background'> </div>
      <div className='third-background'> </div>

      <div className='list-img-container'>
        <img src={isValid? userData.imageFile : defaultPersonImg}
             alt={'Profile owner'}
             onClick={openModal}
        />
      </div>

      <h2>{userData.user.charAt(0).toUpperCase() + userData.user.substring(1)}</h2>

      {
        // Shows the friend request button in the header in mobile devices.
        deviceType === DeviceTypes.MOBILE && view === CollectionView.OTHERS?
          <button className='button-open-section collection-header-button'>Friend request</button>
          :
          ''
      }

      <div className='collection-overview'>
        <h4>Overview</h4>
        <p>Total: <span>{userData.count.totalPlants} Plants</span></p>
        <p>
          Experience:
          <span className='star-container'>
            {
              [...Array(5)].map((item, index) => {
                return (
                  <span className={`star ${index < userData.experience? 'filled' : ''}`} key={`star-rating-${index}`} />
                );
              })
            }
          </span>
        </p>
        <p>Planter: <span>{userData.typePlanter.charAt(0).toUpperCase() + userData.typePlanter.substring(1)}</span></p>
        <p>Badges: <span>{userData.totalBadges}</span></p>
      </div>

      {
        // Sets the correct options to show for owner/others viewing the collection.
        view === CollectionView.OTHERS?
          <div className='controls'>! Report</div>
          :
          <div className='controls'>Delete</div>
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