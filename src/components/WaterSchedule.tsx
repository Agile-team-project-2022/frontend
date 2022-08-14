import React from 'react';
import './WaterSchedule.css';
import DataSection from "./DataSection";
import Calendar from 'react-calendar';

export interface IWaterScheduleProps {}

const WaterSchedule: React.FunctionComponent<IWaterScheduleProps> = () => {
  const selectDay = (date: Date) => {
    console.log('changed', date);
  };

  return (
    <DataSection title='Water schedule' onClickSection={() => {}}>
      <Calendar onChange={selectDay} value={new Date()}/>
    </DataSection>
  );
}

export default WaterSchedule;