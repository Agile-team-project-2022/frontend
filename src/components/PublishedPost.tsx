import React, {Fragment, useContext, useEffect, useState} from 'react';
import './PublishedPost.css';
import {AppContext, PostData} from "../context";
import {CheckEncodedImage, parseDate} from "../helpers";
import defaultPostImg from '../assets/example-plant-2.jpeg';
import {LazyLoadImage} from "react-lazy-load-image-component";
import flagImg from '../assets/report.png';
import likeImg from '../assets/like-empty.png';
import likedImg from '../assets/like-filled.png';
import commentImg from '../assets/comment.png';
import axios from "axios";

export interface IPublishedPostProps {
  post: PostData
}

const PublishedPost: React.FunctionComponent<IPublishedPostProps> = ({post}) => {
  const {state: {userData: {userId}, BASE_URL}} = useContext(AppContext);
  const [readMore, setReadMore] = useState(false);
  const [expandedPost, setExpandedPost] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likePostId, setLikePostId] = useState(-1);

  useEffect(() => {
    // Trims the post.
    if(post.content.length > 250) {setReadMore(true);}

    // Detects if the current user has already liked the post.
    post.postlikes.forEach((item, index) => {
      if(userId === item.userId) {
        setLiked(true);
        setLikePostId(item.id);
      }
    });

    // Initializes the number of posts to keep track as the user changes it.
    setLikeCount(post.postlikes.length);
  }, [post]);

  /** Read more or less for extensive posts. */
  const expandPost = () => {
    setExpandedPost(true);
  };

  const collapsePost = () => {
    setExpandedPost(false);
  };

  /** Sets or removes the like status. */
  const like = () => {
    if(!liked) {
      // Creates new like relationship.
      const url = `${ BASE_URL }postlike`;
      const data = {
        userId: userId,
        postId: post.id
      };

      axios.post(url, data)
        .then((response) => {
          setLikePostId(response.data.id);
          setLiked(true);
          setLikeCount(prevState => prevState + 1);
        })
        .catch((e) => console.log(e));
    } else {
      // Removes the Like.
      const url = `${ BASE_URL }postlike/${likePostId}`;

      axios.delete(url)
        .then((response) => {
          setLikePostId(-1);
          setLiked(false);
          setLikeCount(prevState => prevState - 1);
        })
        .catch((e) => console.log(e));
    }
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
        <button>
          <img alt='Report content' src={flagImg}/>
          Report content
        </button>
        <button onClick={like}>
          <img alt='Like' src={liked? likedImg : likeImg}/>
          Like ({likeCount})
        </button>
        <button>
          <img alt='Comments' src={commentImg}/>
          Comments ({post.comments.length})
        </button>
      </div>
    </div>
  );
}

export default PublishedPost;