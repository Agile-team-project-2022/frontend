import React, {Fragment, useContext, useEffect, useState} from 'react';
import './PublishedPost.css';
import {AppContext, CommentData, PostData, ThumbnailData} from "../context";
import {CheckEncodedImage, parseDate} from "../helpers";
import defaultPostImg from '../assets/example-plant-2.jpeg';
import {LazyLoadImage} from "react-lazy-load-image-component";
import flagImg from '../assets/report.png';
import likeImg from '../assets/like-empty.png';
import likedImg from '../assets/like-filled.png';
import commentImg from '../assets/comment.png';
import axios from "axios";
import Comments from "./Comments";
import {DeviceTypes} from "../hooks/useWindowSize";

export interface IPublishedPostProps {
  post: PostData
}

const PublishedPost: React.FunctionComponent<IPublishedPostProps> = ({post}) => {
  const {state: {userData: {userId}, BASE_URL, deviceType}} = useContext(AppContext);
  const [readMore, setReadMore] = useState(false);
  const [expandedPost, setExpandedPost] = useState(false);
  const [authorPlantData, setAuthorPlantData] = useState<ThumbnailData>({id: -1, name: '', imageFile: ''});
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likePostId, setLikePostId] = useState(-1);
  const [commentCount, setCommentCount] = useState(0);
  const [updatedComments, setUpdatedComments] = useState<CommentData[]>([]);
  const [expandComments, setExpandComments] = useState(false);

  useEffect(() => {
    // Trims the post.
    const threshold = deviceType === DeviceTypes.MOBILE? 210 : 250;
    if(post.content.length > threshold) {setReadMore(true);}

    // Detects if the current user has already liked the post. // TODO: Add postlikes and comments in the returned array of Posts from get a single plant.
    if(post.postlikes && post.comments) {
      post.postlikes.forEach((item, index) => {
        if(userId === item.userId) {
          setLiked(true);
          setLikePostId(item.id);
        }
      });

      // Initializes the number of posts and comments to keep track as the user changes them.
      setLikeCount(post.postlikes.length);
      setCommentCount(post.comments.length);
      setUpdatedComments(post.comments);
    }
  }, [post, userId, deviceType]);

  /** TODO: Gets the full plant data, replace to get only Thumbnail plant data. */
  useEffect(() => {
    const fetchPlant = () => {
      const url = `${ BASE_URL }plant/${ post.plantId }`;
      axios.get(url)
        .then((response) => {
          setAuthorPlantData(response.data);
        })
        .catch((e) => console.log(e));
    };

    fetchPlant();
    // eslint-disable-next-line
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

  /** Receives the updated number of comments to display in the buttons. */
  const onUpdateComments = (count: number, newComment: CommentData) => {
    setCommentCount(count);
    setUpdatedComments(prevState => [...prevState, newComment]);
  };

  /** Expands or hides the comments section. */
  const handleClickComments = () => {
    setExpandComments(prevState => !prevState);
  };

  /** In case of having inappropriate posts content, flags/reports it to be deleted. */
  const flagPost = () => {
    // TODO: Decide what do to after being reported.
    const url = `${ BASE_URL }post-flag`;
    const data = {
      userId: userId,
      postId: post.id
    };

    axios.post(url, data)
      .then((response) => {
        console.log('Content flagged successfully.');
      })
      .catch((e) => console.log(e));
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
                return item !== ''?
                  <Fragment key={`paragraph-item-published-post-${index}`}>
                    {item.charAt(0).toUpperCase() + item.substring(1)}
                    <br/><br/>
                  </Fragment>
                  :
                  '';
              })
            }
          </p>
        </div>
        { readMore && !expandedPost? <span className='read-more' onClick={expandPost}>Read more <div> </div></span> : '' }
        { readMore && expandedPost? <span className='read-more show-less' onClick={collapsePost}> Show less <div> </div></span> : '' }
      </div>

      <div className='published-post-buttons'>
        <div className='published-post-signature'>
          <span>By "{authorPlantData.name.charAt(0).toUpperCase() + authorPlantData.name.substring(1)}"</span>
          <div className='signature-img-container'>
            <img src={CheckEncodedImage(authorPlantData.imageFile)? authorPlantData.imageFile : defaultPostImg} alt='Author post plant'/>
          </div>
        </div>

        <button onClick={flagPost}>
          <img alt='Report content' src={flagImg}/>
          {deviceType === DeviceTypes.DESKTOP? 'Report content' : ''}
        </button>
        <button onClick={like}>
          <img alt='Like' src={liked? likedImg : likeImg}/>
          {deviceType === DeviceTypes.DESKTOP? 'Like' : ''} ({likeCount})
        </button>
        <button onClick={handleClickComments}>
          <img alt='Comments' src={commentImg}/>
          {deviceType === DeviceTypes.DESKTOP? 'Comments' : ''} ({commentCount})
        </button>
      </div>

      {expandComments? <Comments onUpdateComments={onUpdateComments} comments={updatedComments} postId={post.id}/> : ''}
    </div>
  );
}

export default PublishedPost;