import React, {useContext, useEffect, useState} from 'react';
import './PublishedImage.css';
import './PublishedPost.css';
import {AppContext, PostData, ThumbnailData} from "../context";
import {CheckEncodedImage} from "../helpers";
import defaultPostImg from '../assets/example-plant-2.jpeg';
import {LazyLoadImage} from "react-lazy-load-image-component";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export interface IPublishedImageProps {
  post: PostData
}

const PublishedImage: React.FunctionComponent<IPublishedImageProps> = ({post}) => {
  const {state: {BASE_URL}} = useContext(AppContext);
  const [authorPlantData, setAuthorPlantData] = useState<ThumbnailData>({id: -1, name: '', imageFile: ''});
  const [authorPlantDataOwnerID, setAuthorPlantDataOwnerID] = useState(-1);
  const navigate = useNavigate();

  /** Gets the full plant data. */
  useEffect(() => {
    const fetchPlant = () => {
      const url = `${ BASE_URL }plant/${ post.plantId }`;
      axios.get(url)
        .then((response) => {
          setAuthorPlantData(response.data);
          setAuthorPlantDataOwnerID(response.data.ownerId);
        })
        .catch((e) => console.log(e));
    };

    fetchPlant();
    // eslint-disable-next-line
  }, [post]);

  /** Redirects to plant profile. */
  const goToPlant = (plantId: number, ownerId: number) => {
    navigate(`/plant-profile/${ plantId }/${ ownerId }`, {replace: false});
  };

  return (
    <div className='post-image-gallery-published post-container-published'>
      <div className='post-image-gallery-container'>
        <LazyLoadImage src={CheckEncodedImage(post.imageFile)? post.imageFile : defaultPostImg} alt='Post'/>
      </div>

      <div className='published-post-buttons'>
        <div className='published-post-signature'>
          <span>By "{authorPlantData.name.charAt(0).toUpperCase() + authorPlantData.name.substring(1)}"</span>
          <div className='signature-img-container' onClick={() => goToPlant(authorPlantData.id, authorPlantDataOwnerID)}>
            <img src={CheckEncodedImage(authorPlantData.imageFile)? authorPlantData.imageFile : defaultPostImg}
                 alt='Author post plant'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublishedImage;