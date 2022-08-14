import React, {useEffect} from 'react';
import './WaterSchedule.css';
import DataSection from "./DataSection";
import Calendar from 'react-calendar';
import {months} from "../helpers";

export interface IWaterScheduleProps {}

const WaterSchedule: React.FunctionComponent<IWaterScheduleProps> = () => {
  const currentDate = new Date();
  const weekdays = ['M', 'T', 'W', 'Th', 'F', 'S', 'S'];

  useEffect(() => {
    hideDays();
  });

  /** TODO: Decide how to manage the water schedule in backend. */
  const selectDay = (date: Date) => {
    console.log('changed', date);
  };

  /** Hides the prev and next days from other months. */
  const hideDays = () => {
    const allDays = document.querySelectorAll('.react-calendar__month-view__days__day abbr');
    let lastDay = 0;
    let currentDay = 0;
    for(let i = 0; i < allDays.length; i++) {
      currentDay = parseInt(allDays[i].textContent || '0');
      if((lastDay === 0 && currentDay > 20) || (currentDay < lastDay)) {
        const parent = allDays[i].parentElement;
        parent?.classList.add('date-out-range');
      } else {
        lastDay = currentDay;
      }
    }
  };

  return (
    <DataSection title='Water schedule' onClickSection={() => {}}>
      <div className='schedule-month-year'>
        <span>{months[currentDate.getMonth()]}</span> <span>{currentDate.getFullYear()} </span>
      </div>
      <div className='schedule-days'>
        { weekdays.map((item, index) => <span key={`weekday-${index}`}>{item}</span>) }
      </div>
      <Calendar onChange={selectDay} value={new Date()}/>
    </DataSection>
  );
}

export default WaterSchedule;