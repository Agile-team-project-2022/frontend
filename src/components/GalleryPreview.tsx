import React from 'react';
import './GalleryPreview.css';
import {CheckEncodedImage} from '../helpers';
import {LazyLoadImage} from "react-lazy-load-image-component";
import defaultPlantImg from "../assets/example-plant-2.jpeg"; // TODO: Select correct default image.

export interface IGalleryPreviewProps {
  imageFiles: string[]
}

const GalleryPreview: React.FunctionComponent<IGalleryPreviewProps> = ({imageFiles}) => {
  return (
    <div className='gallery-preview-container'>
      <h2 className='section-title'>Photo gallery <span>({imageFiles.length})</span></h2>
      <div className='gallery-preview-content'>
        {
          imageFiles.map((item, index) => {
            return (
              <div className='gallery-img-container list-img-container' key={`gallery-preview-item-${index}`}>
                {/* TODO: change index by an unique image ID. */}
                <LazyLoadImage src={CheckEncodedImage(item)? item : defaultPlantImg} alt='Plant gallery item' />
              </div>
            );
          })
        }

        <button className='arrow-button' >
          <div> </div>
          <div> </div>
        </button>
      </div>
    </div>
  );
}

export default GalleryPreview;