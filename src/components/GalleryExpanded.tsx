import React from 'react';
import './GalleryExpanded.css';
import cancelImg from "../assets/cancel.png";
import Modal from "./Modal";

export interface IGalleryExpandedProps {
  imageFile: string,
  onClose: () => void
}

const GalleryExpanded: React.FunctionComponent<IGalleryExpandedProps> = ({imageFile, onClose}) => {
  return (
    <Modal onClose={onClose} className='expanded-gallery-picture-modal'>
      {/* TODO: Add arrows to switch images from gallery. */}
      <button className='close-gallery-button' onClick={onClose}><img src={cancelImg} alt='Cancel'/></button>
      <div className='expanded-gallery-img-container'><img src={imageFile} alt='Expanded profile'/></div>
    </Modal>
  );
}

export default GalleryExpanded;