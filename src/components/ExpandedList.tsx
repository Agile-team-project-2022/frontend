import React, {useContext, useEffect, useState} from 'react';
import Modal from "./Modal";
import {LazyLoadImage} from "react-lazy-load-image-component";
import sunImg from '../assets/category-sun.jpg';
import {AppContext, ThumbnailData} from "../context";
import noContent from "../assets/no-content-yet.png";

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
  const {state: {userData: {followedPlants, friends, count}}} = useContext(AppContext);
  const [showSection, setShowSection] = useState(false);
  // TODO: Fetch the data and add images.
  const [data, setData] = useState<ThumbnailData[]>([]);
  const [totalData, setTotalData] = useState(0);

  /** Initializes the flag telling if the list should appear expanded at first or not. */
  useEffect(() => {
    setShowSection(show);
  }, [show]);

  useEffect(() => {
    if(type === ListType.FOLLOWED_PLANTS) setTotalData(count.totalFollowedPlants);
    else setTotalData(count.totalFriends);
  }, [count.totalFollowedPlants, count.totalFriends, type]);

  /** Expands the modal containing the list with the data. */
  const openSection = () => {
    // Only queries the content if it is not loaded yet.
    if(data.length === 0) {
      // TODO: Add images.
      if(type === ListType.FOLLOWED_PLANTS) {
        console.log('Using already stored following plants data...');
        setData(followedPlants);
      } else {
        console.log('Using already stored friends data...');
        setData(friends);
      }
    }

    setShowSection(true);
  };

  /** Closes the modal. */
  const closeSection = () => {
    setShowSection(false);
    if(onClose) onClose();
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
                      >
                        <div className='list-img-container'>
                          {/* TODO: Add the correct plant name and img assets. */}
                          <LazyLoadImage src={sunImg}
                                         alt={`Item from list: ${item.id} use name here`}
                          />
                        </div>
                        <p> {item.id} Use name here </p>
                      </div>
                    );
                  })
                }

                { data.length === 0? <div className='not-found-container'> <img src={noContent} alt='No content to show'/> </div> : ''}
              </div>

              <div className='modal-list-buttons'>
                <button className='button-action' onClick={closeSection}> Close </button>
                <button className='button-action'> Load more </button>
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