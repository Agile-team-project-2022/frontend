import React, {useContext} from 'react';
import './CollectionPlants.css';
import CollectionCard from "./CollectionCard";
import {AppContext} from "../context";

export interface ICollectionPlantsProps {}

const CollectionPlants: React.FunctionComponent<ICollectionPlantsProps> = (props) => {
  const {state: {userData: {plants, totalPlants}}} = useContext(AppContext);

  return (
    <div className="collection-plants">
      <h2>Collection of plants ({totalPlants})</h2>

      <div className='collection-cards-container'>
        {
          plants.map((item, index) => {
            return (
              <CollectionCard plant={item} key={`collection-card-${index}`} />
            );
          })
        }

        { // TODO: Remove this block. It's used only to preview how the collection looks with more plants.
          Array(...[...plants, ...plants, ...plants]).map((item, index) => {
            return (
              <CollectionCard plant={item} key={`collection-card-${index}+1`} />
            );
          })
        }

      </div>
    </div>
  );
}

export default CollectionPlants;