import React from 'react';
import './CollectionPlants.css';

export interface ICollectionPlantsProps {}

const CollectionPlants: React.FunctionComponent<ICollectionPlantsProps> = (props) => {
  return (
    <header className="collection-plants">
      <h2>Collection of plants (10)</h2>
    </header>
  );
}

export default CollectionPlants;