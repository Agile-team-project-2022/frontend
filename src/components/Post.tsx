import React, {useContext} from 'react';
import './Post.css';
import {AppContext} from "../context";
import InputImage from "./InputImage";

export interface IPostProps {}

const Post: React.FunctionComponent<IPostProps> = (props) => {
  const {state: {userData: {plants, count: {totalPlants}}}} = useContext(AppContext);

  const uploadNewImage = (encodedImg: string) => {

  };

  return (
    <div className='post-container'>
      <div className='post-content'>
        <h2 className='section-title'>Write new post</h2>
        <label className='post-select-profile'>
          <span>Select profile to publish from <div> </div></span>
          <select>
            <option selected disabled>Select plant profile</option>
            <option value='profile 1'>Profile 1</option>
          </select>
        </label>

        <InputImage onUploadImage={uploadNewImage}> <span>Upload image</span> </InputImage>
        <input className='input-section' type='text' placeholder='Type the title of the Post here...' />
        <textarea className='input-section' placeholder='Write your Post here...' />
      </div>
      <div className='new-post-buttons'>
        <button className='button-action'> Cancel </button>
        <button className='button-action'> Publish </button>
      </div>
    </div>
  );
}

export default Post;