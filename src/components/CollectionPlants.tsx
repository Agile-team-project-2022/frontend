import React, {useContext} from 'react';
import './CollectionPlants.css';
import CollectionCard from "./CollectionCard";
import {AppContext} from "../context";

export interface ICollectionPlantsProps {}

const CollectionPlants: React.FunctionComponent<ICollectionPlantsProps> = (props) => {
  const {state: {userData: {plants, count: {totalPlants}}}} = useContext(AppContext);

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
      </div>
    </div>
  );
}

export default CollectionPlants;