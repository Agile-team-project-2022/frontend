import React, {useState} from 'react';
import './GalleryPreview.css';
import {CheckEncodedImage} from '../helpers';
import {LazyLoadImage} from "react-lazy-load-image-component";
import defaultPlantImg from "../assets/example-plant-2.jpeg";
import GalleryExpanded from "./GalleryExpanded";

export interface IGalleryPreviewProps {
  imageFiles: string[]
}

const GalleryPreview: React.FunctionComponent<IGalleryPreviewProps> = ({imageFiles}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const selectImage = (imageFile: string) => {
    setSelectedImage(imageFile);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className='gallery-preview-container'>
      <h2 className='section-title'>Photo gallery <span>({imageFiles.length})</span></h2>
      <div className='gallery-preview-content'>
        {
          imageFiles.map((item, index) => {
            return (
              <div className='gallery-img-container'
                   key={`gallery-preview-item-${index}`}
                   onClick={() => selectImage(item)}
              >
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

      {modalIsOpen? <GalleryExpanded imageFile={selectedImage} onClose={closeModal} /> : ''}
    </div>
  );
}

export default GalleryPreview;