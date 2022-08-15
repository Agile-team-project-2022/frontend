import React from 'react';
import './Location.css';
import DataSection from "./DataSection";
import mapImg from '../assets/map-gray.png';

export interface ILocationProps {}

const Location: React.FunctionComponent<ILocationProps> = () => {
  return (
    <DataSection title='Location' onClickSection={() => {}}>
      <div className='location-container'>
        <div className='location-container-background'>
          <img src={mapImg} alt='Global map' />
          <div className='location-marker'> </div>
        </div>
        <p><span>Altitude: </span> 2800m</p>
      </div>
    </DataSection>
  );
}

export default Location;