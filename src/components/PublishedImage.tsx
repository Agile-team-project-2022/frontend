import React, {useContext, useEffect, useState} from 'react';
import './PublishedImage.css';
import './PublishedPost.css';
import {AppContext, AppValidActions, PostData, ThumbnailData} from "../context";
import {CheckEncodedImage} from "../helpers";
import defaultPostImg from '../assets/example-plant-2.jpeg';
import {LazyLoadImage} from "react-lazy-load-image-component";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {DeviceTypes} from "../hooks/useWindowSize";

export interface IPublishedImageProps {
  post: PostData
}

const PublishedImage: React.FunctionComponent<IPublishedImageProps> = ({post}) => {
  const {state: {BASE_URL, deviceType}, dispatch} = useContext(AppContext);
  const [authorPlantData, setAuthorPlantData] = useState<ThumbnailData>({id: -1, name: '', imageFile: ''});
  const [authorPlantDataOwnerID, setAuthorPlantDataOwnerID] = useState(-1);
  const [threshold, setThreshold] = useState(5);
  const navigate = useNavigate();

  /** Determines how many gallery pictures can be rendered in the same post depending on the device. */
  useEffect(() => {
    if(deviceType === DeviceTypes.MOBILE) setThreshold(3);
    else if(deviceType === DeviceTypes.TABLET) setThreshold(5);
    else setThreshold(7);
  }, [deviceType]);

  /** Gets the full plant data. */
  useEffect(() => {
    const fetchPlant = () => {
      const url = `${ BASE_URL }plant/${ post.plantId }`;
      axios.get(url)
        .then((response) => {
          setAuthorPlantData(response.data);
          setAuthorPlantDataOwnerID(response.data.ownerId);
        })
        .catch((e) => {
          if(e.message.includes('Request failed with status code 401')) dispatch({type: AppValidActions.LOG_OUT});
          else console.log(e.message);
        });
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
      <div className='images-post-shared-author-container' >
        {
          (post.imagesArr?.slice(0, Math.min(post.imagesArr?.length, threshold)) || []).map((imageFile, index) => {
            return (
              <div className='post-image-gallery-container' key={`post-gallery-${post.id}-${index}`}>
                <LazyLoadImage src={CheckEncodedImage(imageFile)? imageFile : defaultPostImg}
                               alt='Post from gallery'
                />
              </div>
            );
          })
        }
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