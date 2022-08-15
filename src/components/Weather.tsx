import React from 'react';
import './Weather.css';
import DataSection from "./DataSection";
import {Player} from "@lottiefiles/react-lottie-player";
import animatedSun from "../assets/sun.json";
import animatedPlant from "../assets/plant.json";
import animatedCloud from "../assets/cloud.json";

export interface IWeatherProps {}

const Weather: React.FunctionComponent<IWeatherProps> = () => {
  const date = new Date();
  const time = `${date.getHours()}: ${date.getMinutes()}`;

  return (
    <DataSection title='Live weather' onClickSection={() => {}}>
      <div className='weather-animation-container'>
        <div className="cloud-animation">
          <Player id="cloud-lottie"
                  autoplay
                  loop
                  src={animatedCloud}
          />
        </div>
        <div className="sun-animation">
          <Player id="sun-lottie"
                  autoplay
                  loop
                  src={animatedSun}
          />
        </div>
        <div className="plant-animation">
          <Player id="plant-lottie"
                  autoplay
                  loop
                  src={animatedPlant}
          />
        </div>
        <div className='ground'> </div>
      </div>

      <div className='weather-data-outer-container'>
        <div className='weather-data-container'>
          {/* TODO: Fill with the fetched data. */}
          <label><div className='clock'><div> </div></div> {time}</label>
          <h6>25ºC</h6>
          <div className='data-content'>
            <p><span>UV: </span> High</p>
            <p><span>Humidity: </span> 50%</p>
            <p><span>Wind: </span> 2m/s</p>
          </div>
        </div>
      </div>
    </DataSection>
  );
}

export default Weather;