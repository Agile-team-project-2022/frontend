import React, {ChangeEvent, Fragment, useContext, useState} from 'react';
import './Comments.css';
import {AppContext, CommentData, CreateCommentData} from "../context";
import {parseDate} from "../helpers";
import axios from "axios";

export interface ICommentsProps {
  comments: CommentData[],
  onUpdateComments: (count: number, newComment: CommentData) => void,
  postId: number
}

const Comments: React.FunctionComponent<ICommentsProps> = ({comments, onUpdateComments, postId}) => {
  const {state: {userData: {userId}, BASE_URL}} = useContext(AppContext);
  const [newComment, setNewComment] = useState('');

  /** Prepares the formatting of the content as an array before rendering. */
  const formatComment = (text: string) => {
    return text.replace('\n\n', '\n');
  };

  /** Keeps track of the new comment's content. */
  const updateComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
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

    axios.post(url, data)
      .then((response) => {
        console.log(`Successfully created Comment`);
        discardComment();
        // Updates the local list of comments.
        const count = comments.length;
        onUpdateComments(count + 1, response.data);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="comments-container">
      {
        comments.map((item, index) => {
          return (
            <div className='comment-item' key={`comment-item-${item.id}`}>
              <span className='metadata'>{parseDate(item.createdAt)} by {item.authorId} --- TODO: replace with name</span>
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
          />
        </div>
        <div className='new-post-buttons'>
          <button className='button-action' onClick={discardComment}> Cancel </button>
          <button className={`button-action ${newComment.length === 0? 'disabled-button' : ''}`}
                  onClick={saveComment}
                  disabled={newComment.length === 0}
          >
            Publish
          </button>
        </div>
      </div>

    </div>
  );
}

export default Comments;