import React, {useContext, useEffect, useState} from 'react';
import './Collection.css';
import CollectionHeader, {CollectionView} from "../components/CollectionHeader";
import CollectionPlants from "../components/CollectionPlants";
import Badges from "../components/Badges";
import {AppContext, AppValidActions} from "../context";
import {DeviceTypes} from "../hooks/useWindowSize";
import axios from "axios";
import CollectionInteractions from "../components/CollectionInteractions";

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

  /** Fetches the user data and marks it as already 'updated' to avoid future unnecessary queries. */
  const fetchUserData = () => {
    // TODO: Fetch the full associated data.
    const url = `${ state.BASE_URL }user/${state.userId}`;

    axios.get(url)
      .then((response) => {
        const totalPlants = response.data.plants.length; // TODO: get total plants from endpoint

        const data = {
          ...response.data,
          totalPlants: totalPlants
        };

        console.log(data);

        dispatch({type: AppValidActions.SET_USER_DATA, payload: {userData: data}});
      })
      .catch((e) => console.log(e));
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
    if(showBadges) return <div className='mobile-section-container'><Badges/></div>;
    else if(showCollection) return <div className='mobile-section-container'><CollectionPlants/></div>;
    else if(showInteractions) return <CollectionInteractions />;
  };

  return (
    <main className="collection-page">
      <CollectionHeader view={CollectionView.OTHERS} />

      {
        state.deviceType === DeviceTypes.MOBILE?
          <>
            <div className='collection-option-container'>
              <button className={`button-open-section collection-option ${showBadges? 'selected-collection-option' : ''}`}
                      onClick={expandBadges}
              >
                Badges
              </button>
              <button className={`button-open-section collection-option ${showCollection? 'selected-collection-option' : ''}`}
                      onClick={expandCollection}
              >
                Collection
              </button>
              <button className={`button-open-section collection-option ${showInteractions? 'selected-collection-option' : ''}`}
                      onClick={expandInteractions}
              >
                Interactions
              </button>
            </div>

            { getExpandedSection() }
          </>
          :
          <>
            <Badges />
            <CollectionPlants />
            <CollectionInteractions />
          </>
      }
    </main>
  );
}

export default Collection;