import React, {Fragment, useEffect, useState} from 'react';
import './Comments.css';
import {CommentData} from "../context";
import {parseDate} from "../helpers";

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

  /** Prepares the formatting of the content as an array before rendering. */
  const formatComment = (text: string) => {
    return text.replace('\n\n', '\n');
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
                    <Fragment key={`paragraph-item-comment-${item.id}-${indexParagraph}`}>{itemParagraph}<br/><br/></Fragment>
                    :
                    '';
                })}
              </p>
            </div>
          );
        })
      }
    </div>
  );
}

export default Comments;