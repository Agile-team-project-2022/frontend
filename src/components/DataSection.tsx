import React, {ReactNode, useContext} from 'react';
import './DataSection.css';
import {AppContext} from "../context";
import {DeviceTypes} from "../hooks/useWindowSize";

export interface IDataSectionProps {
  children: ReactNode,
  title: string,
  totalItems?: number,
  onClickSection: () => void
}

const DataSection: React.FunctionComponent<IDataSectionProps> = ({
    children,
    title,
    totalItems,
    onClickSection
}) => {
  const {state: {deviceType}} = useContext(AppContext);
  const threshold = deviceType === DeviceTypes.MOBILE? 20 : 5;

  return (
    <div className="data-section-container">
      <h4 className={`data-section-title ${totalItems !== undefined && totalItems > 0? '' : 'disabled-open-section'}`}
          onClick={onClickSection}
      >
        {title} {totalItems !== undefined? `(${totalItems})` : ''}
      </h4>
      <div className="data-section-content">
        {children}
        {
          totalItems !== undefined && totalItems > threshold?
            <button className='arrow-button' onClick={onClickSection} >
              <div> </div>
              <div> </div>
            </button>
            :
            ''
        }
      </div>
    </div>
  );
}

export default DataSection;