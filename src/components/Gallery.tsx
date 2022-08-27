import React, {useContext, useState} from 'react';
import './Gallery.css';
import {CheckEncodedImage} from '../helpers';
import Modal from "./Modal";
import {LazyLoadImage} from "react-lazy-load-image-component";
import defaultPlantImg from "../assets/example-plant-2.jpeg";
import saveImg from '../assets/save.png';
import cancelImg from '../assets/cancel.png';
import GalleryExpanded from "./GalleryExpanded";
import InputImage from "./InputImage";
import {CollectionView} from "./CollectionHeader";
import {AppContext, AppValidActions} from "../context";
import axios from "axios";
import Loading from "./Loading";

export interface IGalleryProps {
  imageFiles: string[],
  onClose: () => void,
  view: CollectionView,
  plantId: number
}

const Gallery: React.FunctionComponent<IGalleryProps> = ({imageFiles, onClose, view, plantId}) => {
  const {state: {BASE_URL, userData: {userId}}, dispatch} = useContext(AppContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [image, setImage] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  /** Receives and saves the new uploaded image. */
  const uploadNewImage = (encodedImg: string) => {
    if(CheckEncodedImage(encodedImg)) setImage(encodedImg);
  };

  /** Marks the image to view expanded. */
  const selectImage = (imageFile: string) => {
    setSelectedImage(imageFile);
    setModalIsOpen(true);
  };

  /** Closes the expanded single image. */
  const closeModal = () => {
    setModalIsOpen(false);
  };

  /** Cancels the uploading of the image. */
  const discardImage = () => {
    setImage('');
  };

  /** Saves the image. */
  const saveImage = () => {
    setDisableButton(true);
    setLoadingData(true);
    const url = `${ BASE_URL }post`;
    const data = {
      authorId: userId,
      plantId: plantId,
      imageFile: image
    };
    axios.post(url, data)
      .then((response) => {
        console.log(`Successfully created image in gallery`);
        dispatch({type: AppValidActions.UPDATE_HOME_POSTS, payload: {homePosts: response.data}});
        setDisableButton(false);
        setLoadingData(false);
        setImage('');
      })
      .catch((e) => {
        console.log(e);
        setDisableButton(false);
        setLoadingData(false);
        setImage('');
      });
  };

  /** Switches images. */
  const switchToLeft = () => {
    const index =  (((imageFiles.indexOf(selectedImage) - 1)  % (imageFiles.length)) + imageFiles.length) % (imageFiles.length);
    setSelectedImage(imageFiles[index]);
  };

  const switchToRight = () => {
    const index = ((imageFiles.indexOf(selectedImage)) + 1) % imageFiles.length;
    setSelectedImage(imageFiles[index]);
  };

  return (
    <Modal onClose={onClose} className='gallery-modal'>
      <h2 className='section-title-modal'>Gallery of photos ({imageFiles.length})</h2>
      <div className='gallery-grid-content'>
        {
          imageFiles.map((item, index) => {
            return (
              <div className='gallery-img-container'
                   key={`gallery-grid-item-${index}`}
                   onClick={() => selectImage(item)}
              >
                <LazyLoadImage src={CheckEncodedImage(item)? item : defaultPlantImg} alt='Plant gallery item' />
              </div>
            );
          })
        }

        <div className='new-image-container'>
          <InputImage onUploadImage={uploadNewImage}
                      className='hidden-message'
                      disabled={disableButton}
          >
            {
              view === CollectionView.OWNER?
                image === ''?
                  <div className='add-button'><div> </div><div> </div></div>
                  :
                  <div className='gallery-img-container'
                       key={`gallery-grid-item-new-image`}
                  >
                    <LazyLoadImage src={CheckEncodedImage(image)? image : defaultPlantImg} alt='Plant gallery item' />
                  </div>
                :
                ''
            }

            { loadingData? <Loading className='load-new-image' /> : '' }
          </InputImage>

          {
            image !== ''?
              <div className='new-img-buttons'>
                <button onClick={discardImage} > <img src={cancelImg} alt='Cancel' /> </button>
                <button disabled={disableButton} onClick={saveImage} > <img src={saveImg} alt='Save'/> </button>
              </div>
              :
              ''
          }
        </div>
      </div>

      {
        modalIsOpen?
          <GalleryExpanded imageFile={selectedImage}
                           onClose={closeModal}
                           switchToLeft={switchToLeft}
                           switchToRight={switchToRight}
          />
          :
          ''
      }
    </Modal>
  );
}

export default Gallery;