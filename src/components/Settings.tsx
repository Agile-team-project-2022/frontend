import React, {ChangeEvent, useContext, useEffect} from 'react';
import './Settings.css';
import {AppContext, AppValidActions} from "../context";
import img1 from '../assets/login-img-1.jpg';
import img2 from '../assets/login-img-2.jpg';
import img3 from '../assets/login-img-3.jpg';
import img4 from '../assets/flower.jpeg';
import resetImg from '../assets/reset.png';

export interface ISettingsProps {}

const Settings: React.FunctionComponent<ISettingsProps> = () => {
  const {state: {settings: {fontSize, grayscale, contrast, brightness}}, dispatch} = useContext(AppContext);

  /** Updates css variables based on the new set contrast. */
  useEffect(() => {
    const root = document.documentElement;
    if(root) {
      // Highlights text, critical borders, and backgrounds.
      if(contrast > 110) {
        root.style.setProperty('--color-gray-background', '#D4D6D6');
        root.style.setProperty('--color-gray-light', '#D4D6D6');
        root.style.setProperty('--color-gray-medium', '#babfbf');
        root.style.setProperty('--color-gray-border', '#D4D6D6');
        root.style.setProperty('--color-contrast-shadow', `rgba(0, 0, 0, ${contrast / 800})`);
        root.style.setProperty('--color-contrast-border', `rgba(0, 0, 0, ${contrast / 600})`);
        root.style.setProperty('--color-black-text', 'rgba(0, 0, 0, 1)');
      } else {
        root.style.setProperty('--color-gray-background', '#F1F3F3');
        root.style.setProperty('--color-gray-light', '#F5F7F9');
        root.style.setProperty('--color-gray-medium', '#dce0e3');
        root.style.setProperty('--color-gray-border', '#e6e9eb');
        root.style.setProperty('--color-contrast-shadow', 'transparent');
        root.style.setProperty('--color-contrast-border', 'transparent');
        root.style.setProperty('--color-black-text', 'rgba(0, 0, 0, 0.8)');
      }
    }
  }, [contrast]);

  /** Revert all the changes done. */
  const handleReset = () => {
    const bodyCollection = document.getElementsByTagName('html');
    const body = bodyCollection[0];
    body.style.fontSize = '1rem';
    body.style.filter = '';
    dispatch({type: AppValidActions.CHANGE_SETTINGS, payload: {
        newSettings: {
          fontSize: 1,
          contrast: 100,
          brightness: 100,
          grayscale: 0
        }
      }});
  };

  /** Updates the value of font size base on the slider. */
  const handleOnChangeFontSize = (e: ChangeEvent<HTMLInputElement>) => {
    const bodyCollection = document.getElementsByTagName('html');
    const body = bodyCollection[0];
    body.style.fontSize = `${e.target.value}rem`;
    dispatch({type: AppValidActions.CHANGE_SETTINGS, payload: {
      newSettings: { fontSize: parseFloat(e.target.value)}
    }});
  };

  /** Updates the saturation of the app. */
  const handleOnChangeGrayscale = (e: ChangeEvent<HTMLInputElement>) => {
    const bodyCollection = document.getElementsByTagName('html');
    const body = bodyCollection[0];
    let appliedFilters = body.style.filter.split(' ');
    let alreadyApplied = false;
    appliedFilters = appliedFilters.map((item) => {
      if(item.startsWith('grayscale')) {
        alreadyApplied = true;
        return `grayscale(${grayscale}%)`;
      }
      else return item;
    });
    if(!alreadyApplied) appliedFilters.push(`grayscale(${grayscale}%)`);
    body.style.filter = appliedFilters.join(' ');
    dispatch({type: AppValidActions.CHANGE_SETTINGS, payload: {
        newSettings: { grayscale: parseFloat(e.target.value)}
    }});
  };

  /** Updates the saturation of the app. */
  const handleOnChangeContrast = (e: ChangeEvent<HTMLInputElement>) => {
    const bodyCollection = document.getElementsByTagName('html');
    const body = bodyCollection[0];
    let appliedFilters = body.style.filter.split(' ');
    let alreadyApplied = false;
    appliedFilters = appliedFilters.map((item) => {
      if(item.startsWith('contrast')) {
        alreadyApplied = true;
        return `contrast(${contrast}%)`;
      }
      else return item;
    });
    if(!alreadyApplied) appliedFilters.push(`contrast(${contrast}%)`);
    body.style.filter = appliedFilters.join(' ');
    dispatch({type: AppValidActions.CHANGE_SETTINGS, payload: {
        newSettings: { contrast: parseFloat(e.target.value)}
    }});
  };

  /** Updates the saturation of the app. */
  const handleOnChangeBrightness = (e: ChangeEvent<HTMLInputElement>) => {
    const bodyCollection = document.getElementsByTagName('html');
    const body = bodyCollection[0];
    let appliedFilters = body.style.filter.split(' ');
    let alreadyApplied = false;
    appliedFilters = appliedFilters.map((item) => {
      if(item.startsWith('brightness')) {
        alreadyApplied = true;
        return `brightness(${brightness}%)`;
      }
      else return item;
    });
    if(!alreadyApplied) appliedFilters.push(`brightness(${brightness}%)`);
    body.style.filter = appliedFilters.join(' ');
    dispatch({type: AppValidActions.CHANGE_SETTINGS, payload: {
        newSettings: { brightness: parseFloat(e.target.value)}
      }});
  };

  return (
    <div className='settings-container'>
      <h2 className='section-title-modal'>Settings</h2>

      <div className='settings-content'>
        <div className='settings-option-item'>
          <div className='settings-option-img'><img src={img1} alt='Plant' /></div>
          <span className='slider-label'>Font size</span>
          <input type='range'
                 min={0.8} max={1.2} step={0.01}
                 value={fontSize}
                 onChange={(e) => handleOnChangeFontSize(e)}
                 className='settings-slider'
          />
          <span className='min-slider-label'>Smaller</span>
          <span className='max-slider-label'>Larger</span>
        </div>

        <div className='settings-option-item'>
          <div className='settings-option-img'><img src={img2} alt='Plant' /></div>
          <span className='slider-label'>Grayscale</span>
          <input type='range'
                 min={0} max={100} step={0.1}
                 value={grayscale}
                 onChange={(e) => handleOnChangeGrayscale(e)}
                 className='settings-slider'
          />
          <span className='min-slider-label'>Colorful</span>
          <span className='max-slider-label'>Gray</span>
        </div>

        <div className='settings-option-item'>
          <div className='settings-option-img'><img src={img3} alt='Plant' /></div>
          <span className='slider-label'>Contrast</span>
          <input type='range'
                 min={80} max={120} step={0.1}
                 value={contrast}
                 onChange={(e) => handleOnChangeContrast(e)}
                 className='settings-slider'
          />
          <span className='min-slider-label'>Low</span>
          <span className='max-slider-label'>High</span>
        </div>
      </div>

      <div className='settings-option-item'>
        <div className='settings-option-img'><img src={img4} alt='Plant' /></div>
        <span className='slider-label'>Brightness</span>
        <input type='range'
               min={70} max={120} step={0.1}
               value={brightness}
               onChange={(e) => handleOnChangeBrightness(e)}
               className='settings-slider'
        />
        <span className='min-slider-label'>Dark</span>
        <span className='max-slider-label'>Bright</span>
      </div>

      <div className='reset-button'>
        <div> </div>
        <span>Reset to default</span>
        <img src={resetImg} alt='Reset' onClick={handleReset} />
      </div>
    </div>
  );
}

export default Settings;