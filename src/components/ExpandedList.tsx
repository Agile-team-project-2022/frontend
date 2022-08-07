import React, {useContext, useEffect, useState} from 'react';
import Modal from "./Modal";
import {LazyLoadImage} from "react-lazy-load-image-component";
import sunImg from '../assets/category-sun.jpg';
import {AppContext, FollowedPlantData, FriendData} from "../context";

export enum ListType {
  FOLLOWED_PLANTS = 'FOLLOWED_PLANTS',
  FRIENDS = 'FRIENDS'
}

export interface IExpandedListProps {
  title: string,
  type: ListType
}

const ExpandedList: React.FunctionComponent<IExpandedListProps> = ({title, type}) => {
  const {state: {userData: {followedPlants, friends, count}}} = useContext(AppContext);
  const [showSection, setShowSection] = useState(false);
  // TODO: Fetch the data and add images.
  const [data, setData] = useState<(FollowedPlantData | FriendData)[]>([]);
  const [totalData, setTotalData] = useState(0);

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

                {
                  data.length === 0?
                    <div>Nothing to show yet!</div>
                    :
                    ''
                }
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