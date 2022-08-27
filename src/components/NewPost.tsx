import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import './NewPost.css';
import {AppContext, AppValidActions, CreatePostData} from "../context";
import InputImage from "./InputImage";
import {CheckEncodedImage} from "../helpers";
import axios from "axios";
import {DeviceTypes} from "../hooks/useWindowSize";

export interface INewPostProps {
  plantId?: number
}

const NewPost: React.FunctionComponent<INewPostProps> = ({plantId}) => {
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
  const [disableButton, setDisableButton] = useState(false);
  const [confirmSuccess, setConfirmSuccess] = useState(false);

  /** Sets the profile to publish from as the plant id if the new post is located within a plant profile. */
  useEffect(() => {
    if(plantId) setPlantProfile(plantId);
  }, [plantId]);

  /** Receives and saves the new uploaded image to use in the post. */
  const uploadNewImage = (encodedImg: string) => {
    if(CheckEncodedImage(encodedImg)) setImage(encodedImg);
  };

  /** Assigns the author plant of the post. */
  const selectPlantProfile = (e: ChangeEvent<HTMLSelectElement>) => {
    const plantId = parseInt(e.target.selectedOptions[0].id);
    setPlantProfile(plantId);
    let plantName = e.target.value;
    plantName = plantName.length > 20? `${plantName.substring(0, 20)}...` : plantName;
    setPlantProfileName(plantName);
    setHighlightSelect(false);
  };

  /** Updates the content of the post. */
  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHighlightTitle(false);
  };

  const updateContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHighlightContent(false);
  };

  /** Empties all the fields. */
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

  /** Sends the request for saving while preventing multiple clicks. */
  const savePost = () => {
    const url = `${ BASE_URL }post`;
    const data: CreatePostData = {
      title: title,
      content: content,
      authorId: userData.userId,
      plantId: plantProfile || -1,
      imageFile: image
    };
    setDisableButton(true);
    axios.post(url, data)
      .then((response) => {
        console.log(`Successfully created Post`);
        showConfirmationSuccess();
        discardPost();
        // Once saved in the Database, retrieves the updated posts list and updates it in the app.
        fetchAllPosts();
        setDisableButton(false);
      })
      .catch((e) => {
        console.log(e);
        setDisableButton(false);
      });
  };

  /** Queries all the stored posts to show. */
  const fetchAllPosts = () => {
    const url = `${ BASE_URL }post?page=1&count=1000`; // TODO: use count and page parameters
    axios.get(url)
      .then((response) => {
        dispatch({type: AppValidActions.UPDATE_HOME_POSTS, payload: {homePosts: response.data}});
      })
      .catch((e) => console.log(e));
  };

  /** Shows a confirmation animation when the post is successfully published. */
  const showConfirmationSuccess = () => {
    setConfirmSuccess(true);
    setTimeout(() => {
      setConfirmSuccess(false);
    }, 3500);
  };

  return (
    <div className='post-container'>
      <div className='post-content'>
        <h2 className='section-title'>Write new post</h2>

        <label className={`${plantId? 'hidden-select-profile' : ''} post-select-profile`}>
          <span className={`${highlightSelect? 'invalid-post-select' : ''}`}>
            <label>{plantProfileName}</label>
            <div> </div>
          </span>
          <select defaultValue={-1}
                  onChange={(e) => selectPlantProfile(e)}
                  disabled={disableButton}
          >
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

        <InputImage onUploadImage={uploadNewImage}
                    className={image === ''? 'hidden-message' : ''}
                    disabled={disableButton}
        >
          { image === ''? <span>Upload image</span> : <img src={image} alt='NewPost plant'/> }
        </InputImage>

        <input className={`input-section ${highlightTitle? 'invalid-post-input' : ''}`}
               type='text'
               placeholder='Type the title of the NewPost here...'
               onChange={(e) => updateTitle(e)}
               value={title}
               disabled={disableButton}
        />

        <textarea className={`input-section ${highlightContent? 'invalid-post-input' : ''}`}
                  placeholder='Write your NewPost here...'
                  onChange={(e) => updateContent(e)}
                  value={content}
                  disabled={disableButton}
        />
      </div>

      <div className='new-post-buttons'>
        <button className='button-action' onClick={discardPost}> Cancel </button>
        <button className={`button-action ${validatePost()? 'disabled-button' : ''}`}
                onClick={validatePost()? showHints : savePost}
                disabled={disableButton}
        >
          Publish
        </button>
      </div>

      {
        confirmSuccess?
          <div className='success-new-post-container'>
            <div className="success-animation-container">
              <div className="success-animation">
                <div> </div>
                <div> </div>
              </div>
            </div>
          </div>
          :
          ''
      }
    </div>
  );
}

export default NewPost;