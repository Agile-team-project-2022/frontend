import React, {useContext} from 'react';
import './CollectionPlants.css';
import CollectionCard from "./CollectionCard";
import {AppContext} from "../context";
import {CollectionView} from "./CollectionHeader";
import NewProfile from "./NewProfile";
import Modal from "./Modal";

export interface ICollectionPlantsProps {
  view: CollectionView,
  ownerId: number
}

const CollectionPlants: React.FunctionComponent<ICollectionPlantsProps> = ({view, ownerId}) => {
  /** TODO: Fetch plants from others instead of userData. */
  const {state: {userData: {plants, count: {totalPlants}}}} = useContext(AppContext);

  return (
    <div className="collection-plants">
      <h2>Collection of plants ({totalPlants})</h2>

      <div className='collection-cards-container'>
        {
          plants.map((item, index) => {
            return (
              <CollectionCard ownerId={ownerId} plant={item} key={`collection-card-${index}`} />
            );
          })
        }

        {view === CollectionView.OWNER? <div className='add-button'><div> </div><div> </div></div> : ''}
      </div>

      <Modal onClose={() => {}}>
        <NewProfile />
      </Modal>
    </div>
  );
}

export default CollectionPlants;