import React from 'react';
import './PlantProfile.css';
import {useParams} from "react-router-dom";

export interface IPlantProfileProps {}

const PlantProfile: React.FunctionComponent<IPlantProfileProps> = () => {
  const {plantId, ownerId} = useParams();

  return (
    <main className="plant-profile-page">
      Plants!
      {plantId}
    </main>
  );
}

export default PlantProfile;