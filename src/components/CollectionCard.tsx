import React from 'react';
import './CollectionCard.css';
import {LazyLoadImage} from "react-lazy-load-image-component";
import plantImg from "../assets/example-plant-2.jpeg";
import {PlantData} from "../context";

export interface ICollectionCardProps {
  plant: PlantData,
}

const CollectionCard: React.FunctionComponent<ICollectionCardProps> = ({plant}) => {
  return (
    <div className="collection-single-card-container">
      <div className='card-img-container' >
        <LazyLoadImage src={plantImg} alt={`Badge`} />
      </div>

      <div className='card-data-container'>
        <p>Name: <span>{plant.name}</span></p>
        <p>Species: <span>{plant.species}</span></p>
        <p>Age: <span>extra large content that should not fit -{/* TODO: put age in endpoint. */}</span></p>
      </div>
    </div>
  );
}

export default CollectionCard;