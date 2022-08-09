import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import './PublishedPost.css';
import {AppContext} from "../context";
import InputImage from "./InputImage";
import {CheckEncodedImage} from "../helpers";
import defaultPostImg from '../assets/example-plant-2.jpeg';

export interface IPublishedPostProps {

}

const PublishedPost: React.FunctionComponent<IPublishedPostProps> = () => {
  const {state: {userData}} = useContext(AppContext);
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');



  const uploadNewImage = (encodedImg: string) => {
    if(CheckEncodedImage(encodedImg)) setImage(encodedImg);
  };

  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const updateContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const discardPost = () => {
    setImage('');
    setTitle('');
    setContent('');
  };

  const savePost = () => {
    console.log(userData)
  };

  return (
    <div className='post-container'>
      <div className='post-content'>
        <h2 className='section-title'>Published</h2>
        <label className='post-select-profile'>
          <span>Select profile to publish from <div> </div></span>
          <select>
            <option selected disabled>Select plant profile</option>
            <option value='profile 1'>Profile 1</option>
            <option value='profile 2'>Profile 2</option>
          </select>
        </label>
        <InputImage onUploadImage={uploadNewImage} className={image === ''? 'hidden-message' : ''}>
          { image === ''? <span>Upload image</span> : <img src={image} alt='NewPost plant'/> }
        </InputImage>
        <input className='input-section'
               type='text'
               placeholder='Type the title of the NewPost here...'
               onChange={(e) => updateTitle(e)}
               value={title}
        />
        <textarea className='input-section'
                  placeholder='Write your NewPost here...'
                  onChange={(e) => updateContent(e)}
                  value={content}
        />
      </div>

      <div className='new-post-buttons'>
        <button className='button-action' onClick={discardPost}> Cancel </button>
        <button className='button-action' onClick={savePost}> Publish </button>
      </div>
    </div>
  );
}

export default PublishedPost;