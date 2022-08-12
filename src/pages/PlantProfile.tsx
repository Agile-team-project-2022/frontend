import React from 'react';
import './PlantProfile.css';
import {useParams} from "react-router-dom";
import {CollectionView} from "../components/CollectionHeader";
import ProfileHeader from "../components/ProfileHeader";

export interface IPlantProfileProps {}

const PlantProfile: React.FunctionComponent<IPlantProfileProps> = () => {
  const {plantId, ownerId} = useParams();

  return (
    <main className="plant-profile-page">
      <ProfileHeader view={CollectionView.OWNER} />
      {plantId}
      {ownerId}
    </main>
  );
}

export default PlantProfile;