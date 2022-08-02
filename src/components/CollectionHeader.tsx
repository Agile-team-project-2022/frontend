import React, {useContext} from 'react';
import './CollectionHeader.css';
import personImg from '../assets/example-people-1.jpeg';
import {AppContext} from "../context";

export interface ICollectionHeaderProps {}

const CollectionHeader: React.FunctionComponent<ICollectionHeaderProps> = (props) => {
  const {state} = useContext(AppContext);

  return (
    <header className="collection-header collection-profile-header">
      <div className='first-background'> </div>
      <div className='second-background'> </div>

      <div className='list-img-container'>
        <img src={personImg} alt={'Profile owner'} />
      </div>

      <h2>{state.user.charAt(0).toUpperCase() + state.user.substring(1)}</h2>

      <div className='collection-overview'>
        <h4>Overview</h4>
        <p>Total: <span>{state.userData.totalPlants} Plants</span></p>
        <p>
          Experience:
          {
            [...Array(5)].map((item, index) => {
              return (
                <span className={`star ${index < state.userData.experience? 'filled' : ''}`} key={`star-rating-${index}`} />
              );
            })
          }
        </p>
        <p>Type of planter: <span>{state.userData.typePlanter.charAt(0).toUpperCase() + state.userData.typePlanter.substring(1)}</span></p>
        <p>Badges: <span>{state.userData.totalBadges}</span></p>
      </div>
    </header>
  );
}

export default CollectionHeader;