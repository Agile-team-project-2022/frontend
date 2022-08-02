import React, {useContext, useEffect} from 'react';
import './Collection.css';
import CollectionHeader from "../components/CollectionHeader";
import CollectionPlants from "../components/CollectionPlants";
import Badges from "../components/Badges";
import {AppContext, AppValidActions} from "../context";

export interface ICollectionProps {}

const Collection: React.FunctionComponent<ICollectionProps> = (props) => {
  const {state, dispatch} = useContext(AppContext);

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

  return (
    <main className="collection-page">
      <CollectionHeader />
      <Badges />

      <CollectionPlants />
      <div className='collection-interactions'>
        Interactions
      </div>
    </main>
  );
}

export default Collection;