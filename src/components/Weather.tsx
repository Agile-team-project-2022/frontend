import React, {useEffect, useState} from 'react';
import './Weather.css';
import DataSection from "./DataSection";
import {Player} from "@lottiefiles/react-lottie-player";
import animatedSun from "../assets/sun.json";
import animatedPlant from "../assets/plant.json";
import animatedCloud from "../assets/cloud.json";
import animatedMoon from '../assets/moon.json';
import animatedStars from '../assets/stars.json';
import axios from "axios";

export interface IWeatherProps {
  latitude: number,
  longitude: number
}

const Weather: React.FunctionComponent<IWeatherProps> = ({latitude, longitude}) => {
  const [time, setTime] = useState('');
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    getWeather();
  }, []);

  /** Fetches the weather data to openweathermap.org */
  const getWeather = () => {
    const url = `https://api.openweathermap.org/data/2.5/weather/?lat=${latitude}&lon=${longitude}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`;
    axios.get(url)
      .then((res) => {
        console.log(res.data);
        const sunrise = new Date(res.data.sys.sunrise * 1000);
        const sunset = new Date(res.data.sys.sunset * 1000);
        const viewerTime = new Date();
        const plantTime = (viewerTime.getHours() + (viewerTime.getTimezoneOffset() / 60) + (res.data.timezone / 3600)) % 24;

        setTime(`${plantTime}: ${viewerTime.getMinutes()}`);
        setIsDay(viewerTime.getTime() > sunrise.getTime() && viewerTime.getTime() < sunset.getTime());
      })
      .catch((e) => console.log(e));
  };

  return (
    <DataSection title='Live weather' onClickSection={() => {}}>
      <div className={isDay? 'day-background' : 'night-background'}>
        <div className='weather-animation-container' >
          <div className="cloud-animation">
            <Player id="cloud-lottie"
                    autoplay
                    loop
                    src={isDay? animatedCloud : animatedStars}
            />
          </div>
          <div className="sun-animation">
            <Player id="sun-lottie"
                    autoplay
                    loop
                    src={isDay? animatedSun : animatedMoon}
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
      </div>
    </DataSection>
  );
}

export default Weather;