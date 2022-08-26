import React from 'react';
import './GalleryExpanded.css';
import closeImg from "../assets/close.png";
import defaultImg from '../assets/not-found.jpeg';
import {CheckEncodedImage} from '../helpers';
import Modal from "./Modal";

export interface IGalleryExpandedProps {
  imageFile: string,
  onClose: () => void,
  switchToLeft?: () => void,
  switchToRight?: () => void,
}

const GalleryExpanded: React.FunctionComponent<IGalleryExpandedProps> = ({imageFile, onClose, switchToLeft, switchToRight}) => {
  return (
    <Modal onClose={onClose} className='expanded-gallery-picture-modal'>
      <button className='close-gallery-button' onClick={onClose}><img src={closeImg} alt='Cancel'/></button>
      {
        switchToLeft && switchToRight?
          <>
            <div className='left-gallery-button gallery-button' onClick={switchToLeft}>
              <button className='arrow-button' >
                <div> </div>
                <div> </div>
              </button>
            </div>
            <div className='right-gallery-button gallery-button' onClick={switchToRight}>
              <button className='arrow-button' >
                <div> </div>
                <div> </div>
              </button>
            </div>
          </>
          :
          ''
      }


      <div className='expanded-gallery-img-container'>
        <img src={CheckEncodedImage(imageFile)? imageFile : defaultImg} alt='Expanded profile'/>
      </div>
    </Modal>
  );
}

export default GalleryExpanded;