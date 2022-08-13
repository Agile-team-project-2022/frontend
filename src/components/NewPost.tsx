import React, {ChangeEvent, useContext, useState} from 'react';
import './NewPost.css';
import {AppContext, AppValidActions, CreatePostData} from "../context";
import InputImage from "./InputImage";
import {CheckEncodedImage} from "../helpers";
import axios from "axios";
import {DeviceTypes} from "../hooks/useWindowSize";

export interface IPostProps {}

const NewPost: React.FunctionComponent<IPostProps> = () => {
  const {state: {userData, BASE_URL, deviceType}, dispatch} = useContext(AppContext);
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [plantProfile, setPlantProfile] = useState<number | undefined>(undefined);
  const [plantProfileName, setPlantProfileName] = useState(
    `${deviceType === DeviceTypes.DESKTOP && !window.location.href.includes('plant-profile')? 'Select profile to publish from' : 'Select profile'}`
  );
  const [highlightSelect, setHighlightSelect] = useState(false);
  const [highlightTitle, setHighlightTitle] = useState(false);
  const [highlightContent, setHighlightContent] = useState(false);

  const uploadNewImage = (encodedImg: string) => {
    if(CheckEncodedImage(encodedImg)) setImage(encodedImg);
  };

  const selectPlantProfile = (e: ChangeEvent<HTMLSelectElement>) => {
    const plantId = parseInt(e.target.id);
    setPlantProfile(plantId);
    let plantName = e.target.value;
    plantName = plantName.length > 20? `${plantName.substring(0, 20)}...` : plantName;
    setPlantProfileName(plantName);
    setHighlightSelect(false);
  };

  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHighlightTitle(false);
  };

  const updateContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHighlightContent(false);
  };

  const discardPost = () => {
    setImage('');
    setTitle('');
    setContent('');
  };

  /** Indicates 'true' if the save button should be disabled. */
  const validatePost = () => {
    return plantProfile === undefined || title.length === 0 || content.length === 0;
  };

  /** Highlights the missing values. */
  const showHints = () => {
    plantProfile === undefined? setHighlightSelect(true) : setHighlightSelect(false);
    title.length === 0? setHighlightTitle(true) : setHighlightTitle(false);
    content.length === 0? setHighlightContent(true) : setHighlightContent(false);
  };

  const savePost = () => {
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
        // Once saved in the Database, retrieves the updated posts list and updates it in the app.
        fetchAllPosts();
      })
      .catch((e) => console.log(e));
  };

  /** Queries all the stored posts to show. */
  const fetchAllPosts = () => {
    const url = `${ BASE_URL }post?page=1&count=100`; // TODO: use count and page parameters
    axios.get(url)
      .then((response) => {
        dispatch({type: AppValidActions.UPDATE_HOME_POSTS, payload: {homePosts: response.data}});
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className='post-container'>
      <div className='post-content'>
        <h2 className='section-title'>Write new post</h2>

        <label className='post-select-profile'>
          <span className={`${highlightSelect? 'invalid-post-select' : ''}`}>
            <label>{plantProfileName}</label>
            <div> </div>
          </span>
          <select defaultValue={-1} onChange={(e) => selectPlantProfile(e)}>
            <option value={-1} disabled>Select plant profile</option>
            {
              userData.plants.map((item, index) => {
                return (
                  <option id={`${item.id}`} value={`${item.name}`} key={`plant-profile-option-${item.id}`}>
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

        <input className={`input-section ${highlightTitle? 'invalid-post-input' : ''}`}
               type='text'
               placeholder='Type the title of the NewPost here...'
               onChange={(e) => updateTitle(e)}
               value={title}
        />

        <textarea className={`input-section ${highlightContent? 'invalid-post-input' : ''}`}
                  placeholder='Write your NewPost here...'
                  onChange={(e) => updateContent(e)}
                  value={content}
        />
      </div>

      <div className='new-post-buttons'>
        <button className='button-action' onClick={discardPost}> Cancel </button>
        <button className={`button-action ${validatePost()? 'disabled-button' : ''}`}
                onClick={validatePost()? showHints : savePost}
        >
          Publish
        </button>
      </div>
    </div>
  );
}

export default NewPost;