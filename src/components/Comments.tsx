import React, {ChangeEvent, Fragment, useContext, useEffect, useState} from 'react';
import './Comments.css';
import {AppContext, CommentData, CreateCommentData} from "../context";
import {parseDate} from "../helpers";
import axios from "axios";
import flagImg from "../assets/report.png";
import deleteImg from '../assets/delete.png';

export interface ICommentsProps {
  comments: CommentData[],
  onUpdateComments: (count: number, newComment: CommentData, deleteComment: boolean) => void,
  postId: number
}

const Comments: React.FunctionComponent<ICommentsProps> = ({comments, onUpdateComments, postId}) => {
  const {state: {userData: {userId}, BASE_URL}} = useContext(AppContext);
  const [newComment, setNewComment] = useState('');
  const [commentsAuthorMap, setCommentsAuthorMap] = useState<{[commentId: number]: string}>({0: ''});
  const [disableButton, setDisableButton] = useState(false);

  /** Initializes the map of authors. */
  useEffect(() => {
    comments.forEach((item) => getAuthorName(item.authorId, item.id));
  }, [comments]);

  /** Prepares the formatting of the content as an array before rendering. */
  const formatComment = (text: string) => {
    return text.replace('\n\n', '\n');
  };

  /** Keeps track of the new comment's content. */
  const updateComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  /** Gets the user author name. */
  const getAuthorName = (commentAuthorId: number, commentId: number) => {
    const url = `${ BASE_URL }user/${ commentAuthorId }`;

    axios.get(url)
      .then((res) => {
        setCommentsAuthorMap(prevState => {
          return{
            ...prevState,
            [commentId]: res.data.name
          }
        });
      })
      .catch((e) => console.log(e));
  };

  /** Drop the draft of the comment. */
  const discardComment = () => {
    setNewComment('');
  };

  /** Saves the comment into the DB. */
  const saveComment = () => {
    const url = `${ BASE_URL }comment`;
    const data : CreateCommentData = {
      content: newComment,
      authorId: userId,
      postId: postId
    };
    setDisableButton(true);

    axios.post(url, data)
      .then((response) => {
        console.log(`Successfully created Comment`);
        discardComment();
        // Updates the local list of comments.
        const count = comments.length;
        onUpdateComments(count + 1, response.data, false);
        setDisableButton(false);
      })
      .catch((e) => {
        console.log(e);
        setDisableButton(false);
      });
  };

  /** Deletes the comment. Only available for author. */
  const deleteComment = (commentId: number) => {
    const url = `${ BASE_URL }comment/${ commentId }`;
    setDisableButton(true);

    axios.delete(url)
      .then((response) => {
        console.log(`Deleted Comment`);
        // Updates the local list of comments.
        const count = comments.length;
        onUpdateComments(count - 1, response.data, true);
        setDisableButton(false);
      })
      .catch((e) => {
        console.log(e);
        setDisableButton(false);
      });
  };

  return (
    <div className="comments-container">
      {
        comments.map((item, index) => {
          return (
            <div className='comment-item' key={`comment-item-${item.id}`}>
              <span className='metadata'>
                {parseDate(item.createdAt)} by "{(commentsAuthorMap[item.id] || '').charAt(0).toUpperCase() + (commentsAuthorMap[item.id] || '').substring(1)}"
              </span>

              {
                item.authorId === userId?
                  <button className='delete-comment-button' onClick={() => deleteComment(item.id)} disabled={disableButton} >
                    <img alt='Delete content' src={deleteImg}/>
                  </button>
                  :
                  ''
              }

              <p>
                {formatComment(item.content).split('\n').map((itemParagraph, indexParagraph) => {
                  return itemParagraph !== ''?
                    <Fragment key={`paragraph-item-comment-${item.id}-${indexParagraph}`}>
                      {itemParagraph.charAt(0).toUpperCase() + itemParagraph.substring(1)}
                      <br/><br/>
                    </Fragment>
                    :
                    '';
                })}
              </p>
            </div>
          );
        })
      }

      <div className='new-comment'>
        <div className='new-comment-content'>
          <h4 className='section-title'>New Comment</h4>
          <textarea className='input-section'
                    placeholder='Write your comment here...'
                    onChange={(e) => updateComment(e)}
                    value={newComment}
                    disabled={disableButton}
          />
        </div>
        <div className='new-post-buttons'>
          <button className='button-action' onClick={discardComment}> Cancel </button>
          <button className={`button-action ${newComment.length === 0? 'disabled-button' : ''}`}
                  onClick={saveComment}
                  disabled={newComment.length === 0 || disableButton}
          >
            Publish
          </button>
        </div>
      </div>

    </div>
  );
}

export default Comments;