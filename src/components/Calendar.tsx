import React, {useEffect} from 'react';
import './WaterSchedule.css';
import {Calendar as ReactCalendar} from 'react-calendar';
import {months} from "../helpers";

export interface ICalendarProps {
  onSelectDay: (day: number) => void,
  selectedDates: number[]
}

const Calendar: React.FunctionComponent<ICalendarProps> = ({onSelectDay, selectedDates}) => {
  const currentDate = new Date();
  const weekdays = ['M', 'T', 'W', 'Th', 'F', 'S', 'S'];

  useEffect(() => {
    hideDays();
    // eslint-disable-next-line
  }, [selectedDates]);

  const clickDay = (e: MouseEvent, button: HTMLElement) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    const day = parseInt(button.innerText);
    onSelectDay(day);
  };

  /** Hides the prev and next days from other months. */
  const hideDays = () => {
    const allDays = document.querySelectorAll('.react-calendar__month-view__days__day abbr');
    let lastDay = 0;
    let currentDay = 0;
    for(let i = 0; i < allDays.length; i++) {
      currentDay = parseInt(allDays[i].textContent || '0');
      const parent = allDays[i].parentElement;
      if((lastDay === 0 && currentDay > 20) || (currentDay < lastDay)) {
        parent?.classList.add('date-out-range');
      } else {
        if(selectedDates.includes(currentDay)) parent?.classList.add('selected-day');
        else if(parent?.classList.contains('selected-day')) parent?.classList.remove('selected-day');

        parent?.addEventListener("click", (e) => clickDay(e, parent));
        lastDay = currentDay;
      }
    }
  };

  return (
    <>
      <div className='schedule-month-year'>
        <span>{months[currentDate.getMonth()]}</span> <span>{currentDate.getFullYear()} </span>
      </div>
      <div className='schedule-days'>
        { weekdays.map((item, index) => <span key={`weekday-${index}`}>{item}</span>) }
      </div>
      <ReactCalendar />
    </>
  );
}

export default Calendar;