import React, {useContext, useState} from 'react';
import './Collection.css';
import CollectionHeader, {CollectionView} from "../components/CollectionHeader";
import CollectionPlants from "../components/CollectionPlants";
import Badges from "../components/Badges";
import {AppContext} from "../context";
import {DeviceTypes} from "../hooks/useWindowSize";
import CollectionInteractions from "../components/CollectionInteractions";

export interface ICollectionProps {}

const Collection: React.FunctionComponent<ICollectionProps> = (props) => {
  const {state: {deviceType}} = useContext(AppContext);
  // Manages the sections to expand on mobile devices.
  const [showBadges, setShowBadges] = useState(true);
  const [showCollection, setShowCollection] = useState(false);
  const [showInteractions, setShowInteractions] = useState(false);

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
      <CollectionHeader view={CollectionView.OWNER} />

      {
        deviceType === DeviceTypes.MOBILE?
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