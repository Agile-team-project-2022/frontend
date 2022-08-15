import React from 'react';
import './Weather.css';
import DataSection from "./DataSection";

export interface IWeatherProps {}

const Weather: React.FunctionComponent<IWeatherProps> = () => {
  const date = new Date();
  const time = `${date.getHours()}: ${date.getMinutes()}`;

  return (
    <DataSection title='Live weather' onClickSection={() => {}}>
      <div className='weather-animation-container'> </div>
      <div>
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