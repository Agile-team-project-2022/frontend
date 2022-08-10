import React, {Fragment, useEffect, useState} from 'react';
import './PublishedPost.css';
import {PostData} from "../context";
import {CheckEncodedImage, parseDate} from "../helpers";
import defaultPostImg from '../assets/example-plant-2.jpeg';
import {LazyLoadImage} from "react-lazy-load-image-component";

export interface IPublishedPostProps {
  post: PostData
}

const PublishedPost: React.FunctionComponent<IPublishedPostProps> = ({post}) => {
  const [readMore, setReadMore] = useState(false);

  useEffect(() => {
    if(post.content.length > 250) {setReadMore(true);}
  }, [post]);

  return (
    <div className='post-container-published'>
      <div className='post-content-published'>
        <h2 className='section-title'> {post.title.charAt(0).toUpperCase() + post.title.substring(1)} </h2>
        <span className='post-date'> {parseDate(post.createdAt)} </span>
        <div className='post-image-container-published'>
          <LazyLoadImage src={CheckEncodedImage(post.imageFile)? post.imageFile : defaultPostImg} alt='Post'/>
        </div>
        <div className='post-text-container-published'>
          <p>
            {
              post.content.split('\n').map((item, index) => {
                return item !== ''? <Fragment key={`paragraph-item-published-post-${index}`}>{item}<br/><br/></Fragment> : '';
              })
            }
          </p>
        </div>
        {
          readMore? <span className='read-more'>Read more <div> </div></span> : ''
        }
      </div>

      <div className='new-post-buttons'>
        <button className='button-action'> Cancel </button>
        <button className='button-action'> Publish </button>
      </div>
    </div>
  );
}

export default PublishedPost;