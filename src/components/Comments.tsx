import React, {useEffect, useState} from 'react';
import './Comments.css';
import {CommentData} from "../context";

export interface ICommentsProps {
  inputComments: CommentData[],
  onUpdateComments: (count: number) => void
}

const Comments: React.FunctionComponent<ICommentsProps> = ({inputComments, onUpdateComments}) => {
  const [comments, setComments] = useState<CommentData[]>([]);

  /** Initializes comments. Updated as they are created to avoid fetching the whole post after saving a comment. */
  useEffect(() => {
    setComments(inputComments);
  }, [inputComments]);

  return (
    <div className="comments-container">
      {
        comments.map((item, index) => {
          return (
            <div className='comment-item' key={`comment-item-${item.id}`}>
              Comment
            </div>
          );
        })
      }
    </div>
  );
}

export default Comments;