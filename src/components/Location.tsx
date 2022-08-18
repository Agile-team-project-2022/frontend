import React from 'react';
import './Location.css';
import DataSection from "./DataSection";
import mapImg from '../assets/map-gray.png';
import {mapCoordsToImage} from "../helpers";

export interface ILocationProps {
  altitude: number,
  latitude: number,
  longitude: number
}

const Location: React.FunctionComponent<ILocationProps> = ({altitude, latitude, longitude}) => {
  return (
    <DataSection title='Location' onClickSection={() => {}}>
      <div className='location-container'>
        <div className='location-container-background'>
          <img src={mapImg} alt='Global map' />
          <div className='location-marker'
               style={{
                 top: `${mapCoordsToImage(latitude, longitude).latitude}%`,
                 left: `${mapCoordsToImage(latitude, longitude).longitude}%`
               }}
          >
          </div>
        </div>
        <p><span>Altitude: </span> {altitude}m </p>
      </div>
    </DataSection>
  );
}

export default Location;