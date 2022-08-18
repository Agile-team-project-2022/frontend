import React from 'react';
import './WaterSchedule.css';
import DataSection from "./DataSection";
import Calendar from "./Calendar";

export interface IWaterScheduleProps {}

const WaterSchedule: React.FunctionComponent<IWaterScheduleProps> = () => {
  /** TODO: Decide how to manage the water schedule in backend. */
  const selectDay = (day: number) => {
    console.log('changed to: ', day)
  };

  return (
    <DataSection title='Water schedule' onClickSection={() => {}}>
      {/* TODO: Pass correct selected days. */}
      <Calendar onSelectDay={selectDay} selectedDates={[2, 4, 6, 9, 16, 21, 23, 25]} />
    </DataSection>
  );
}

export default WaterSchedule;