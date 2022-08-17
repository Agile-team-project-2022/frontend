import React, {useState} from 'react';
import './NewProfile.css';
import Calendar from "./Calendar";

export interface INewProfileProps {}

const NewProfile: React.FunctionComponent<INewProfileProps> = () => {
  const [selectedDates, setSelectedDates] = useState<number[]>([]);

  /** TODO: Decide how to manage the water schedule in backend. */
  const selectDay = (day: number) => {
    setSelectedDates(prevState => {
      if(prevState.includes(day)) return prevState.filter(item => item !== day);
      else return [...prevState, day]
    });
  };

  return (
    <div className='new-profile-container'>
      <h2 className='section-title'>Create new Plant profile</h2>
      <span className='instruction-marks'>Required fields are marked with <div className='required-mark input-mark'> </div></span>
      <span className='instruction-marks'>Optional fields are marked with <div className='optional-mark input-mark'> </div></span>

      <label>
        <span>Plant's name:</span> <input className='input-section' type='text' />
        <div className='required-mark input-mark'> </div>
      </label>
      <label>
        <span>Plant's age (years):</span> <input className='input-section' type='number' step={0.1} min={0} placeholder='Example: 0.5 = half year' />
        <div className='optional-mark input-mark'> </div>
      </label>
      <label>
        <span>Species:</span> <input className='input-section' type='text' placeholder='Scientific or popular name' />
        <div className='optional-mark input-mark'> </div>
      </label>

      <div className='section-divisor'> </div>

      <div className='water-schedule-field'>
        <h5>Water schedule: <div className='required-mark input-mark'> </div></h5>
        <p>Define a rule for watering this plant. The rule will be automatically repeated over the next months. To define it, click on the dates when the plant needs water.</p>
        <Calendar onSelectDay={selectDay} selectedDates={selectedDates} />
      </div>

      <div className='modal-list-buttons'>
        <button className='button-action'> Cancel </button>
        <button className='button-action'> Create profile </button>
      </div>
    </div>
  );
}

export default NewProfile;