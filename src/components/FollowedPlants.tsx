import React, {useEffect, useState} from 'react';
import './FollowedPlants.css';
import Modal from "./Modal";
import {LazyLoadImage} from "react-lazy-load-image-component";
import sunImg from '../assets/category-sun.png';

export interface IFollowedPlantsProps {}

const FollowedPlants: React.FunctionComponent<IFollowedPlantsProps> = (props) => {
  const [showSection, setShowSection] = useState(false);
  // TODO: Fetch the plant data and add images.
  const [followedPlants, setFollowedPlants] = useState<{name: string}[]>([]);

  useEffect(() => {
    // TODO: Fetch the plant data and add images.
    setFollowedPlants([
      {name: 'Plant 1'},
      {name: 'Plant 2'},
      {name: 'Plant 3'},
      {name: 'Plant 4'},
      {name: 'Plant 5'}
    ]);
  }, []);

  /** Expands the modal containing the list of followed plants. */
  const openSection = () => {
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
              <h2 className='section-title-modal'>Plants you Follow (20)</h2>

              <div className='list-content'>
                {
                  followedPlants.map((item, index) => {
                    return (
                      <div className='list-item-container'
                           key={`followed-plant-item-${item.name.toLowerCase()}`}
                      >
                        <div className='list-img-container'>
                          {/* TODO: Add the correct plant name and img assets. */}
                          <LazyLoadImage src={sunImg}
                                         alt={`Following: ${item.name.toLowerCase()}`}
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
            Plants you Follow: 20
          </button>
      }
    </>
  );
}

export default FollowedPlants;