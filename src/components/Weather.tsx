import React, {useEffect, useState} from 'react';
import './Weather.css';
import DataSection from "./DataSection";
import {Player} from "@lottiefiles/react-lottie-player";
import animatedSun from "../assets/sun.json";
import animatedPlant from "../assets/plant.json";
import animatedCloud from "../assets/cloud.json";
import animatedMoon from '../assets/moon.json';
import animatedStars from '../assets/stars.json';
import axios, {AxiosRequestHeaders} from "axios";

export interface IWeatherProps {
  latitude?: number,
  longitude?: number,
  setSeaLevel: (level: number) => void
}

const Weather: React.FunctionComponent<IWeatherProps> = ({latitude, longitude, setSeaLevel}) => {
  const [time, setTime] = useState('');
  const [isDay, setIsDay] = useState(true);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState({speed: 0, degree: 0});
  const [cloudPercentage, setCloudPercentage] = useState(0);

  useEffect(() => {
    /** Fetches the weather data to openweathermap.org */
    const instance = axios.create();
    delete instance.defaults.headers.common['Authorization'];
    const getWeather = () => {
      const url = `https://api.openweathermap.org/data/2.5/weather/?lat=${latitude}&lon=${longitude}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`;
      instance.get(url)
        .then((res) => {
          const sunrise = new Date(res.data.sys.sunrise * 1000);
          const sunset = new Date(res.data.sys.sunset * 1000);
          const viewerTime = new Date();
          const plantTime = (viewerTime.getHours() + (viewerTime.getTimezoneOffset() / 60) + (res.data.timezone / 3600)) % 24;

          setTime(`${plantTime}: ${viewerTime.getMinutes()}`);
          setIsDay(viewerTime.getTime() > sunrise.getTime() && viewerTime.getTime() < sunset.getTime());
          setTemperature(res.data.main.temp);
          setHumidity(res.data.main.humidity);
          setCloudPercentage(res.data.clouds.all);
          setWind(prevState => {
            return {
              ...prevState,
              speed: res.data.wind.speed,
              degree: res.data.wind.deg
            }
          });
          setSeaLevel(res.data.main.sea_level);
        })
        .catch((e) => console.log(e));
    };

    if(latitude && longitude) getWeather();
    // eslint-disable-next-line
  }, [latitude, longitude]);

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
            <h6>{temperature}ºC</h6>
            <div className='data-content'>
              <p><span>Clouds: </span> {cloudPercentage}%</p>
              <p><span>Humidity: </span> {humidity}%</p>
              <p className='wind-data'>
                <span>Wind: </span> {wind.speed}m/s
                <label style={{transform: `rotate(${wind.degree + 135}deg)`}}>
                  <span> </span>
                  <span> </span>
                </label>
              </p>
            </div>
          </div>
        </div>
      </div>
    </DataSection>
  );
}

export default Weather;