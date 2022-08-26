import React, {useContext, useState} from 'react';
import './GalleryPreview.css';
import {CheckEncodedImage} from '../helpers';
import {LazyLoadImage} from "react-lazy-load-image-component";
import defaultPlantImg from "../assets/example-plant-2.jpeg";
import GalleryExpanded from "./GalleryExpanded";
import Gallery from "./Gallery";
import {CollectionView} from "./CollectionHeader";
import {useParams} from "react-router-dom";
import {AppContext} from "../context";

export interface IGalleryPreviewProps {
  imageFiles: string[]
}

const GalleryPreview: React.FunctionComponent<IGalleryPreviewProps> = ({imageFiles}) => {
  const {ownerId} = useParams();
  const {state: {userData: {userId}}} = useContext(AppContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showGallery, setShowGallery] = useState(false);

  /** Marks the image to view expanded. */
  const selectImage = (imageFile: string) => {
    setSelectedImage(imageFile);
    setModalIsOpen(true);
  };

  /** Closes the expanded single image. */
  const closeModal = () => {
    setModalIsOpen(false);
  };

  /** Shows the grid view with all gallery pictures. */
  const goToGallery = () => {
    setShowGallery(true);
  };

  /** Closes the grid view of all the pictures of the gallery. */
  const closeGallery = () => {
    setShowGallery(false);
  };

  return (
    <div className='gallery-preview-container'>
      <h2 className='section-title'>Photo gallery <span>({imageFiles.length})</span></h2>
      <div className='gallery-preview-content'>
        {
          imageFiles.slice(0, Math.min(5, imageFiles.length)).map((item, index) => {
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

        <button className='arrow-button' onClick={goToGallery} >
          <div> </div>
          <div> </div>
        </button>
      </div>

      {modalIsOpen? <GalleryExpanded imageFile={selectedImage} onClose={closeModal} /> : ''}
      {
        showGallery?
          <Gallery imageFiles={imageFiles}
                   onClose={closeGallery}
                   view={parseInt(ownerId || '0') === userId? CollectionView.OWNER : CollectionView.OTHERS}
          />
          :
          ''
      }
    </div>
  );
}

export default GalleryPreview;