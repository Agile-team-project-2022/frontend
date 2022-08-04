import React, {useContext, useEffect, useState} from 'react';
import './Collection.css';
import CollectionHeader, {CollectionView} from "../components/CollectionHeader";
import CollectionPlants from "../components/CollectionPlants";
import Badges from "../components/Badges";
import {AppContext, AppValidActions} from "../context";
import {DeviceTypes} from "../hooks/useWindowSize";

export interface ICollectionProps {}

const Collection: React.FunctionComponent<ICollectionProps> = (props) => {
  const {state, dispatch} = useContext(AppContext);
  // Manages the sections to expand on mobile devices.
  const [showBadges, setShowBadges] = useState(true);
  const [showCollection, setShowCollection] = useState(false);
  const [showInteractions, setShowInteractions] = useState(false);

  /** Gets and saves the user data only if it is not already saved. */
  // TODO: Fetch correct user data.
  useEffect(() => {
    if(!state.userData.updated) fetchUserData();
    // eslint-disable-next-line
  }, []);

  /** Fetched the user data and marks it as already 'updated' to avoid future unnecessary queries. */
  const fetchUserData = () => {
    // TODO: Fetch the full associated data.
    const data = {
      updated: true,
      totalPlants: 10,
      experience: 2,
      typePlanter: 'floral',
      badgesPreviewIds: [1, 2, 3, 4, 5], // TODO: Only fetch id of first 5 to show.
      totalBadges: 8
    };

    dispatch({type: AppValidActions.GET_USER_DATA, payload: {userData: data}});
  };

  /** Manages the badges section if the user expands it on mobile devices. */
  const expandBadges = () => {
    setShowBadges(true);
    setShowCollection(false);
    setShowInteractions(false);
  };

  /** Manages the Collection if the user expands it on mobile devices. */
  const expandCollection = () => {
    setShowBadges(false);
    setShowCollection(true);
    setShowInteractions(false);
  };

  /** Manages the Interactions section if the user expands it on mobile devices. */
  const expandInteractions = () => {
    setShowBadges(false);
    setShowCollection(false);
    setShowInteractions(true);
  };

  /** Renders the section selected on mobile devices. */
  const getExpandedSection = () => {
    if(showBadges) {
      return <div className='mobile-section-container'><Badges/></div>;
    } else if(showCollection) {
      return <div className='mobile-section-container'><CollectionPlants/></div>;
    } else if(showInteractions) {
      return (
        <div className='mobile-section-container'>
          <div className='collection-interactions'> Interactions </div>
        </div>
      );
    }
  };

  return (
    <main className="collection-page">
      <CollectionHeader view={CollectionView.OTHERS} />
      {
        state.deviceType === DeviceTypes.MOBILE?
          <>
            <div className='collection-option-container'>
              <button className='button-open-section collection-option' onClick={expandBadges}> Badges </button>
              <button className='button-open-section collection-option' onClick={expandCollection}> Collection </button>
              <button className='button-open-section collection-option' onClick={expandInteractions}> Interactions </button>
            </div>

            { getExpandedSection() }
          </>
          :
          <>
            <Badges />
            <CollectionPlants />
            <div className='collection-interactions'> Interactions </div>
          </>
      }

    </main>
  );
}

export default Collection;