import React from 'react';
import './WaterSchedule.css';
import DataSection from "./DataSection";
import Calendar from "./Calendar";

export interface IWaterScheduleProps {
  selectedDates: number[]
}

const WaterSchedule: React.FunctionComponent<IWaterScheduleProps> = ({selectedDates}) => {
  /** Note: At this stage the schedule is not mutable. Fill the function below to enable it in the future. */
  const selectDay = (day: number) => { };

  return (
    <DataSection title='Water schedule' onClickSection={() => {}}>
      {/* TODO: Pass correct selected days. */}
      <Calendar onSelectDay={selectDay} selectedDates={selectedDates} />
    </DataSection>
  );
}

export default WaterSchedule;