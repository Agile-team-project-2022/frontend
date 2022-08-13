import React from 'react';
import './GalleryPreview.css';
import defaultImg from '../assets/login-img-2.jpg'; // TODO: Select correct default image.
import {CheckEncodedImage} from '../helpers';

export interface IGalleryPreviewProps {
  imageFiles: string[]
}

const GalleryPreview: React.FunctionComponent<IGalleryPreviewProps> = ({imageFiles}) => {
  return (
    <div>
      <h2 className='section-title'>Gallery ({imageFiles.length})</h2>
    </div>
  );
}

export default GalleryPreview;