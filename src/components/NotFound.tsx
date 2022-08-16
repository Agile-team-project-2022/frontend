import React from 'react';
import './NotFound.css';
import notFound from '../assets/not-found-page.jpeg';

export interface INotFoundProps {}

const NotFound: React.FunctionComponent<INotFoundProps> = () => {
  return (
    <div className='not-found-page-container'>
      <img src={notFound} alt='Content not found'/>
    </div>
  );
}

export default NotFound;