import React, {useState} from 'react';
import Modal from "./Modal";
import {LazyLoadImage} from "react-lazy-load-image-component";
import sunImg from '../assets/category-sun.jpg';

export enum ListType {
  FOLLOWED_PLANTS = 'FOLLOWED_PLANTS',
  FRIENDS = 'FRIENDS'
}

export interface IExpandedListProps {
  title: string,
  type: ListType
}

const ExpandedList: React.FunctionComponent<IExpandedListProps> = ({title, type}) => {
  const [showSection, setShowSection] = useState(false);
  // TODO: Fetch the data and add images.
  const [data, setData] = useState<{name: string}[]>([]);

  /** Expands the modal containing the list with the data. */
  const openSection = () => {
    // Only queries the content if it is not loaded yet.
    if(data.length === 0) {
      // TODO: Fetch the correct data and add images.
      if(type === ListType.FOLLOWED_PLANTS) getFollowedPlants();
      else getFriends();
    }

    setShowSection(true);
  };

  /** Closes the modal. */
  const closeSection = () => {
    setShowSection(false);
  };

  /** TODO: Gets the Followed plants data. */
  const getFollowedPlants = () => {
    console.log('Fetching followed plants data...');
    setData([
      {name: 'Plant 1'},
      {name: 'Plant 2'},
      {name: 'Plant 3'},
      {name: 'Plant 4'},
      {name: 'Plant 5'}
    ]);
  };

  /** TODO: Gets the Friends data. */
  const getFriends = () => {
    console.log('Fetching friends data...');
    setData([
      {name: 'Person 1'},
      {name: 'Person 2'},
      {name: 'Person 3'},
      {name: 'Person 4'},
      {name: 'Person 5'}
    ]);
  };

  return (
    <>
      {
        showSection?
          <Modal onClose={closeSection}>
            <div className='modal-list-container'>
              <h2 className='section-title-modal'> {title} ({data.length}) </h2>

              <div className='list-content'>
                {
                  data.map((item, index) => {
                    return (
                      <div className='list-item-container'
                           key={`list-item-${item.name.toLowerCase()}`}
                      >
                        <div className='list-img-container'>
                          {/* TODO: Add the correct plant name and img assets. */}
                          <LazyLoadImage src={sunImg}
                                         alt={`Item from list: ${item.name.toLowerCase()}`}
                          />
                        </div>
                        <p> {item.name.charAt(0).toUpperCase() + item.name.substring(1)} </p>
                      </div>
                    );
                  })
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
            {title}: {data.length}
          </button>
      }
    </>
  );
}

export default ExpandedList;