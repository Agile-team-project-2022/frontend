import React, {ChangeEvent, useContext} from 'react';
import './Settings.css';
import {AppContext, AppValidActions} from "../context";

export interface ISettingsProps {}

const Settings: React.FunctionComponent<ISettingsProps> = () => {
  const {state: {settings: {fontSize, grayscale, contrast, brightness}}, dispatch} = useContext(AppContext);

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
        <div className='settings-option-item font-size-option'>
          <span className='slider-label'>Font size</span>
          <input type='range'
                 min={0.8} max={1.2} step={0.01}
                 value={fontSize}
                 onChange={(e) => handleOnChangeFontSize(e)}
                 className='font-size-slider'
          />
          <span className='min-slider-label'>Smaller</span>
          <span className='max-slider-label'>Larger</span>
        </div>

        <div className='settings-option-item font-size-option'>
          <span className='slider-label'>Grayscale</span>
          <input type='range'
                 min={0} max={100} step={0.1}
                 value={grayscale}
                 onChange={(e) => handleOnChangeGrayscale(e)}
                 className='font-size-slider'
          />
          <span className='min-slider-label'>Colorful</span>
          <span className='max-slider-label'>Gray</span>
        </div>

        <div className='settings-option-item font-size-option'>
          <span className='slider-label'>Contrast</span>
          <input type='range'
                 min={95} max={110} step={0.1}
                 value={contrast}
                 onChange={(e) => handleOnChangeContrast(e)}
                 className='font-size-slider'
          />
          <span className='min-slider-label'>Low</span>
          <span className='max-slider-label'>High</span>
        </div>
      </div>

      <div className='settings-option-item font-size-option'>
        <span className='slider-label'>Brightness</span>
        <input type='range'
               min={70} max={120} step={0.1}
               value={brightness}
               onChange={(e) => handleOnChangeBrightness(e)}
               className='font-size-slider'
        />
        <span className='min-slider-label'>Dark</span>
        <span className='max-slider-label'>Bright</span>
      </div>

    </div>
  );
}

export default Settings;