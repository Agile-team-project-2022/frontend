import React, {useContext, useEffect, useState} from 'react';
import './CollectionHeader.css';
import defaultPersonImg from '../assets/default-person.jpeg';
import {AppContext, UserData} from "../context";
import {DeviceTypes} from "../hooks/useWindowSize";
import Modal from "./Modal";
import ChangeProfilePicture from "./ChangeProfilePicture";
import {CheckEncodedImage} from '../helpers';
import GalleryExpanded from "./GalleryExpanded";
import {SectionType} from "./CollectionInteractions";

export interface ICollectionHeaderProps {
  view: CollectionView,
  othersData?: UserData
}

export enum CollectionView {
  OWNER = 'OWNER',
  OTHERS = 'OTHERS'
}

const CollectionHeader: React.FunctionComponent<ICollectionHeaderProps> = ({view, othersData}) => {
  const {state: {userData, deviceType}} = useContext(AppContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ownerData, setOwnerData] = useState<UserData>(userData);
  const isValid = CheckEncodedImage(view === CollectionView.OWNER? userData.imageFile : othersData?.imageFile || '');

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
        deviceType === DeviceTypes.MOBILE && view === CollectionView.OTHERS?
          <button className='button-open-section collection-header-button'>Friend request</button>
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