import React from 'react';
import './CollectionCard.css';
import {LazyLoadImage} from "react-lazy-load-image-component";
import defaultPlantImg from "../assets/default-plant.jpg";
import {PlantData} from "../context";
import {useNavigate} from "react-router-dom";
import {calculateAgePlant, CheckEncodedImage} from "../helpers";

export interface ICollectionCardProps {
  plant: PlantData,
  ownerId: string | number
}

const CollectionCard: React.FunctionComponent<ICollectionCardProps> = ({plant, ownerId}) => {
  const navigate = useNavigate();

  /** Redirects to the plant's profile. */
  const handleOnClick = () => {
    navigate(`/plant-profile/${plant.id}/${ownerId}`, {replace: false});
  };

  return (
    <div className="collection-single-card-container" onClick={handleOnClick}>
      <div className='card-img-container' >
        <LazyLoadImage src={CheckEncodedImage(plant.imageFile)? plant.imageFile : defaultPlantImg} alt='Collection plant item' />
      </div>

      <div className='card-data-container'>
        <p>Name: <span>{plant.name}</span></p>
        <p>Species: <span>{plant.species}</span></p>
        <p>Age: <span>{calculateAgePlant(plant.initialAge, plant.createdAt)} years</span></p>
      </div>
    </div>
  );
}

export default CollectionCard;