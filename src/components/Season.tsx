import React from 'react';
import './Season.css';
import DataSection from "./DataSection";

export interface ISeasonProps {}

const Season: React.FunctionComponent<ISeasonProps> = () => {
  return (
    <DataSection title='Season (now)' onClickSection={() => {}}>
      <div className='season-container'>
        <div className='season-container-background'> </div>
        <p>Spring</p>
      </div>
    </DataSection>
  );
}

export default Season;