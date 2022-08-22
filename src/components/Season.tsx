import React, {useEffect, useState} from 'react';
import './Season.css';
import DataSection from "./DataSection";
import noSeasonImg from '../assets/no-season.jpeg';
import springImg from '../assets/spring.jpeg';
import summerImg from '../assets/summer.jpeg';
import fallImg from '../assets/fall.jpeg';
import winterImg from '../assets/winter.jpeg';

export interface ISeasonProps {
  latitude?: number
}

enum Seasons {
  WINTER = 'Winter',
  SPRING = 'Spring',
  SUMMER = 'Summer',
  FALL = 'Fall',
  NA = 'No apply'
}

const Season: React.FunctionComponent<ISeasonProps> = ({latitude}) => {
  const [season, setSeason] = useState(Seasons.NA);
  const date = new Date();
  const monthNow = date.getMonth();
  const threshold = 25;
  const north = {
    [Seasons.WINTER]: [12, 1, 2],
    [Seasons.SPRING]: [3, 4, 5],
    [Seasons.SUMMER]: [6, 7, 8],
    [Seasons.FALL]: [9, 10, 11]
  };
  const south = {
    [Seasons.WINTER]: [6, 7, 8],
    [Seasons.SPRING]: [9, 10, 11],
    [Seasons.SUMMER]: [12, 1, 2],
    [Seasons.FALL]: [3, 4, 5]
  };
  const images = {
    [Seasons.WINTER]: winterImg,
    [Seasons.SPRING]: springImg,
    [Seasons.SUMMER]: summerImg,
    [Seasons.FALL]: fallImg,
    [Seasons.NA]: noSeasonImg
  }

  useEffect(() => {
    if(latitude) {
      if(latitude > threshold) {
        Object.entries(north).forEach(([key, value]) => {
          if(value.includes(monthNow + 1)) setSeason(key as Seasons);
        });
      } else if(latitude < -threshold) {
        Object.entries(south).forEach(([key, value]) => {
          if(value.includes(monthNow + 1)) setSeason(key as Seasons);
        });
      }
    }
  // eslint-disable-next-line
  }, [latitude]);

  return (
    <DataSection title='Season (now)' onClickSection={() => {}}>
      <div className='season-container'>
        <div className='season-container-background' style={{backgroundImage: `url(${images[season]})`}}>
        </div>
        <p>{season}</p>
      </div>
    </DataSection>
  );
}

export default Season;