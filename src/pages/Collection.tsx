import React, {useContext, useEffect, useState} from 'react';
import './Collection.css';
import CollectionHeader, {CollectionView} from "../components/CollectionHeader";
import CollectionPlants from "../components/CollectionPlants";
import Badges from "../components/Badges";
import {AppContext, UserData} from "../context";
import {DeviceTypes} from "../hooks/useWindowSize";
import CollectionInteractions from "../components/CollectionInteractions";
import {useParams} from "react-router-dom";
import axios from "axios";

export interface ICollectionProps {
  view: CollectionView
}

const Collection: React.FunctionComponent<ICollectionProps> = ({view}) => {
  const {state: {deviceType, userData: {userId}, BASE_URL}} = useContext(AppContext);
  const {ownerId} = useParams();
  const [othersData, setOthersData] = useState<UserData>();
  // Manages the sections to expand on mobile devices.
  const [showBadges, setShowBadges] = useState(true);
  const [showCollection, setShowCollection] = useState(false);
  const [showInteractions, setShowInteractions] = useState(false);

  useEffect(() => {
    /** Fetches the user data only for Others view. */
    const fetchUserData = () => {
      const url = `${ BASE_URL }user/${ ownerId }`;

      axios.get(url)
        .then((response) => {
          const data = {
            name: response.data.name,
            imageFile: response.data.imageFile,
            friends: response.data.follower.map((item: any) => item.followee),
            pendingFriends: response.data.following.map((item: any) => item.follower)
          };

          setOthersData(data as UserData);
        })
        .catch((e) => console.log(e));
    };

    if(ownerId) fetchUserData();
  }, [ownerId, BASE_URL]);

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
      return (
        <div className='mobile-section-container'><Badges/></div>
      );
    } else if(showCollection) {
      return (
        <div className='mobile-section-container'>
          <CollectionPlants ownerId={view === CollectionView.OWNER ? userId : (ownerId || '')}
                            view={CollectionView.OWNER}
          />
        </div>
      );
    } else if(showInteractions) {
      return (
        <CollectionInteractions friends={othersData?.friends || []}
                                friendsPending={othersData?.pendingFriends || []}
                                view={view}
        />
      );
    }
  };

  return (
    <main className="collection-page">
      <CollectionHeader view={view} />

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
            {/** TODO: Replace with correct owner Data. */}
            <CollectionPlants ownerId={ownerId || userId} view={view} />
            <CollectionInteractions friends={othersData?.friends || []} friendsPending={othersData?.pendingFriends || []} view={view} />
          </>
      }
    </main>
  );
}

export default Collection;