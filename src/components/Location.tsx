import React from 'react';
import './Location.css';
import DataSection from "./DataSection";

export interface ILocationProps {}

const Location: React.FunctionComponent<ILocationProps> = () => {
  return (
    <DataSection title='Location' onClickSection={() => {}}>
      <div className='location-container'>
        <div className='location-container-background'> </div>
        <div className='location-marker'> </div>
        <p><span>Altitude: </span> 2800m</p>
      </div>
    </DataSection>
  );
}

export default Location;