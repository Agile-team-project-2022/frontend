import React, {ReactNode} from 'react';
import './DataSection.css';

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
  return (
    <div className="data-section-container">
      <h4 className="data-section-title"> {title} {totalItems !== undefined? `(${totalItems})` : ''} </h4>
      <div className="data-section-content">
        {children}
        {
          totalItems !== undefined && totalItems > 5?
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