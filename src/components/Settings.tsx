import React, {ChangeEvent, useContext} from 'react';
import './Settings.css';
import {AppContext, AppValidActions} from "../context";

export interface ISettingsProps {}

const Settings: React.FunctionComponent<ISettingsProps> = () => {
  const {state: {fontSize}, dispatch} = useContext(AppContext);

  /** Updates the temporal value of font size base on the slider. */
  const handleOnChangeFontSize = (e: ChangeEvent<HTMLInputElement>) => {
    const bodyCollection = document.getElementsByTagName('html');
    const body = bodyCollection[0];
    body.style.fontSize = `${e.target.value}rem`;
    dispatch({type: AppValidActions.CHANGE_FONT_SIZE, payload: {fontSize: parseFloat(e.target.value)}});
  };

  return (
    <div className='settings-container'>
      <h2 className='section-title-modal'>Settings!</h2>

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
      </div>

    </div>
  );
}

export default Settings;