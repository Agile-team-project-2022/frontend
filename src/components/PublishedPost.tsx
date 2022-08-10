import React, {Fragment, useEffect, useState} from 'react';
import './PublishedPost.css';
import {PostData} from "../context";
import {CheckEncodedImage, parseDate} from "../helpers";
import defaultPostImg from '../assets/example-plant-2.jpeg';
import {LazyLoadImage} from "react-lazy-load-image-component";
import flagImg from '../assets/report.png';
import likeImg from '../assets/like-empty.png';
import commentImg from '../assets/comment.png';

export interface IPublishedPostProps {
  post: PostData
}

const PublishedPost: React.FunctionComponent<IPublishedPostProps> = ({post}) => {
  const [readMore, setReadMore] = useState(false);
  const [expandedPost, setExpandedPost] = useState(false);

  useEffect(() => {
    if(post.content.length > 250) {setReadMore(true);}
  }, [post]);

  const expandPost = () => {
    setExpandedPost(true);
  };

  const collapsePost = () => {
    setExpandedPost(false);
  };

  return (
    <div className={`post-container-published ${expandedPost? 'expanded-post' : ''}`}>
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
        { readMore && !expandedPost? <span className='read-more' onClick={expandPost}>Read more <div> </div></span> : '' }
        { readMore && expandedPost? <span className='read-more show-less' onClick={collapsePost}> Show less <div> </div></span> : '' }
      </div>

      <div className='published-post-buttons'>
        <button> <img alt='Report content' src={flagImg}/> Report content </button>
        <button> <img alt='Like' src={likeImg}/> Like (+1K) </button>
        <button> <img alt='Comments' src={commentImg}/> Comments (10) </button>
      </div>
    </div>
  );
}

export default PublishedPost;