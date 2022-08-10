import React, {ChangeEvent, useContext, useState} from 'react';
import './NewPost.css';
import {AppContext, CreatePostData} from "../context";
import InputImage from "./InputImage";
import {CheckEncodedImage} from "../helpers";
import axios from "axios";

export interface IPostProps {}

const NewPost: React.FunctionComponent<IPostProps> = () => {
  const {state: {userData, BASE_URL}} = useContext(AppContext);
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [plantProfile, setPlantProfile] = useState<number | undefined>(undefined);

  const uploadNewImage = (encodedImg: string) => {
    if(CheckEncodedImage(encodedImg)) setImage(encodedImg);
  };

  const selectPlantProfile = (e: ChangeEvent<HTMLSelectElement>) => {
    const plantId = parseInt(e.target.value);
    setPlantProfile(plantId);
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

  const validatePost = () => {
    return plantProfile === undefined || title.length === 0 || content.length === 0;
  };

  const savePost = () => {
    console.log(userData);
    const url = `${ BASE_URL }post`;
    const data: CreatePostData = {
      title: title,
      content: content,
      authorId: userData.userId,
      plantId: 1,
      imageFile: image
    };

    axios.post(url, data)
      .then((response) => {
        console.log(`Successfully created Post`);
        discardPost();
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className='post-container'>
      <div className='post-content'>
        <h2 className='section-title'>Write new post</h2>

        <label className='post-select-profile'>
          <span>Select profile to publish from <div> </div></span>
          <select defaultValue={-1} onChange={(e) => selectPlantProfile(e)}>
            <option value={-1} disabled>Select plant profile</option>
            {
              userData.plants.map((item, index) => {
                return (
                  <option value={`${item.id}`} key={`plant-profile-option-${item.id}`}>
                    {item.name.charAt(0).toUpperCase() + item.name.substring(1)}
                  </option>
                );
              })
            }
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
        <button className='button-action' onClick={savePost} disabled={validatePost()}> Publish </button>
      </div>
    </div>
  );
}

export default NewPost;