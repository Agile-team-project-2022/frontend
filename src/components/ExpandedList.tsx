import React, {useContext, useEffect, useState} from 'react';
import Modal from "./Modal";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {AppContext, ThumbnailData, PlantData} from "../context";
import noContent from "../assets/no-content-yet.png";
import {CheckEncodedImage} from "../helpers";
import defaultPersonImg from "../assets/default-person.jpeg";
import defaultPlantImg from "../assets/default-plant.jpg";
import {useNavigate} from "react-router-dom";

export enum ListType {
  FOLLOWED_PLANTS = 'FOLLOWED_PLANTS',
  FRIENDS = 'FRIENDS'
}

export interface IExpandedListProps {
  title: string,
  type: ListType,
  show?: boolean,
  onClose?: () => void
}

const ExpandedList: React.FunctionComponent<IExpandedListProps> = ({title, type, show=false, onClose}) => {
  const {state: {userData: {followedPlants, friends}}} = useContext(AppContext);
  const [showSection, setShowSection] = useState(false);
  const [data, setData] = useState<ThumbnailData[]>([]);
  const [totalData, setTotalData] = useState(0);
  const navigate = useNavigate();

  /** Initializes the flag telling if the list should appear expanded at first or not. */
  useEffect(() => {
    setShowSection(show);
  }, [show]);

  /** Initializes the data to show only with already existent plants or users. */
  useEffect(() => {
    if(type === ListType.FOLLOWED_PLANTS) {
      setData(followedPlants);
      setTotalData(followedPlants.length);
    } else {
      setData(friends);
      setTotalData(friends.length);
    }
  }, [type, friends, followedPlants]);

  /** Expands the modal containing the list with the data. */
  const openSection = () => {
    setShowSection(true);
  };

  /** Closes the modal. */
  const closeSection = () => {
    setShowSection(false);
    if(onClose) onClose();
  };

  /** Goes to the owner or plant profile when clicked on the item. */
  const goToProfile = (data: ThumbnailData | PlantData) => {
    if(type === ListType.FOLLOWED_PLANTS) navigate(`/plant-profile/${ (data as PlantData).id }/${ (data as PlantData).ownerId }`, {replace: false});
    else navigate(`/collection/${ data.id }`, {replace: false});
  };

  return (
    <>
      {
        showSection?
          <Modal onClose={closeSection}>
            <div className='modal-list-container'>
              <h2 className='section-title-modal'> {title} ({totalData}) </h2>

              <div className='list-content'>
                {
                  data.map((item, index) => {
                    return (
                      <div className='list-item-container'
                           key={`list-item-${item.id}`}
                           onClick={() => goToProfile(item)}
                      >
                        <div className='list-img-container'>
                          <LazyLoadImage  src={CheckEncodedImage(item.imageFile)? item.imageFile : (type === ListType.FOLLOWED_PLANTS? defaultPlantImg : defaultPersonImg)}
                                          alt={`Relation`}
                          />
                        </div>
                        <p> {item.name.charAt(0).toUpperCase() + item.name.substring(1)} </p>
                      </div>
                    );
                  })
                }

                { data.length === 0? <div className='not-found-container'> <img src={noContent} alt='No content to show'/> </div> : ''}
              </div>

              <div className='modal-list-buttons'>
                <button className='button-action' onClick={closeSection}> Close </button>
                <button className='button-action disabled-button'> Load more </button>
              </div>
            </div>
          </Modal>
          :
          <button className='button-open-section'
                  onClick={openSection}
          >
            {title}: {totalData}
          </button>
      }
    </>
  );
}

export default ExpandedList;