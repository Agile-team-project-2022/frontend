import React, {useContext, useEffect, useState} from 'react';
import DataSection from "../components/DataSection";
import {LazyLoadImage} from "react-lazy-load-image-component";
import treeImg from "../assets/category-tree.jpeg";
import Modal from "./Modal";
import {AppContext, AppValidActions} from "../context";
import {DeviceTypes} from "../hooks/useWindowSize";

export interface IBadgesProps {}

const Badges: React.FunctionComponent<IBadgesProps> = () => {
  const {state, dispatch} = useContext(AppContext);
  const [expanded, setExpanded] = useState(false);

  /** Assigns the whole Badges data only once. */
  useEffect(() => {
    // Avoids calculating again if the data is already hold.
    if(state.userData.badges.length === 0) CalculateBadgesData();
    // eslint-disable-next-line
  }, []);

  const openSection = () => {
    setExpanded(true);
  };

  /** Closes the modal. */
  const closeSection = () => {
    setExpanded(false);
  };

  /** Based on the user data, calculates the assigned badges. */
  const CalculateBadgesData = () => {
    console.log('calculating the owner badges...');
    // TODO: Fetch the full associated data.
    const badges = [
      {name: 'Badge A', id: 1},
      {name: 'Badge B', id: 2},
      {name: 'Badge C', id: 3},
      {name: 'Badge D', id: 4},
      {name: 'Badge E', id: 5},
      {name: 'Badge F', id: 6},
      {name: 'Badge G', id: 7},
      {name: 'Badge H', id: 8},
    ];

    const totalBadges = badges.length;
    const threshold = state.deviceType === DeviceTypes.MOBILE? 20 : 5;

    const previewBadges: string[] = [];
    for(let i = 0; i < Math.min(threshold, totalBadges); i++) {
      previewBadges.push(badges[i].name);
    }

    dispatch({type: AppValidActions.SET_USER_BADGES_DATA, payload: {userData: {
      badges: badges,
      badgesPreviewIds: previewBadges,
      totalBadges: totalBadges
    }}});
  };

  return (
    <div className='collection-badges'>
      <DataSection title='Badges' totalItems={state.userData.totalBadges} onClickSection={openSection}>
        {
          // TODO: Add the correct img assets.
          state.userData.badgesPreviewIds.map((item, index) => {
            return (
              <div className='list-img-container' key={`item-badges-${item}`}>
                <LazyLoadImage src={treeImg} alt={`Badge`} />
              </div>
            );
          })
        }

        {
          expanded?
            <Modal onClose={closeSection}>
              <h2 className='section-title-modal'>Badges ({state.userData.totalBadges})</h2>
              {
                // TODO: Add the correct img assets.
                state.userData.badges.map((item, index) => {
                  return (
                    <div className='list-item-container' key={`list-item-${item.name.toLowerCase()}`}>
                      <div className='list-img-container'>
                        <LazyLoadImage src={treeImg} alt={`Badge ${item.name}`} />
                      </div>
                      <p> {item.name.charAt(0).toUpperCase() + item.name.substring(1)} </p>
                    </div>
                  );
                })
              }
            </Modal>
            :
            ''
        }
      </DataSection>
    </div>
  );
}

export default Badges;