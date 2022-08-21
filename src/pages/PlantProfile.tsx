import React, {Suspense, useContext, useEffect, useState} from 'react';
import './PlantProfile.css';
import './Collection.css';
import './Home.css';
import noContent from '../assets/no-content-yet.png';
import {useNavigate, useParams} from "react-router-dom";
import {CollectionView} from "../components/CollectionHeader";
import ProfileHeader, {PlantHeaderData} from "../components/ProfileHeader";
import {AppContext, PlantData, UserData} from "../context";
import axios from "axios";
import PublishedPost from "../components/PublishedPost";
import NewPost from "../components/NewPost";
import GalleryPreview from "../components/GalleryPreview";
import WaterSchedule from "../components/WaterSchedule";
import {DeviceTypes} from "../hooks/useWindowSize";
import Weather from "../components/Weather";
import Location from "../components/Location";
import Season from "../components/Season";
import DataSection from "../components/DataSection";
import {LazyLoadImage} from "react-lazy-load-image-component";
import defaultPerson from "../assets/default-person.jpeg";
import {CheckEncodedImage} from "../helpers";

export interface IPlantProfileProps {}

const PlantProfile: React.FunctionComponent<IPlantProfileProps> = () => {
  const {plantId, ownerId} = useParams();
  const {state: {deviceType, BASE_URL, userData: {userId, plants, followedPlants}}} = useContext(AppContext);
  const [plantData, setPlantData] = useState<PlantData>();
  const [ownerData, setOwnerData] = useState<UserData>();
  const [locationData, setLocationData] = useState({altitude: 0, latitude: 0, longitude: 0});
  const [scheduleData, setScheduleData] = useState<number[]>([]);
  const [plantHeaderData, setPlantHeaderData] = useState<PlantHeaderData>({id: -1, name: '', imageFile: '', species: '', followers: 0});
  const [disableButton, setDisableButton] = useState(false);
  const [alreadyFollow, setAlreadyFollow] = useState(false);
  // Manages the sections to expand on mobile devices.
  const [showGallery, setShowGallery] = useState(true);
  const [showData, setShowData] = useState(false);
  const [showPublications, setShowPublications] = useState(false);
  const navigate = useNavigate();

  /** Gets the full plant data. */
  useEffect(() => {
    const fetchPlant = () => {
      const url = `${ BASE_URL }plant/${ plantId }`;
      axios.get(url)
        .then((response) => {
          setPlantData(response.data);
          setPlantHeaderData({
            id: plantId? parseInt(plantId) : -1,
            name: response.data.name,
            imageFile: response.data.imageFile,
            species: response.data.species,
            followers: response.data.followers?.length || 0 // TODO: Send total followers
          });

          // Parses the string containing coordinates.
          const coords = response.data.location.split(',');
          if(coords.length === 3) {
            setLocationData(prevState => {
              return {
                ...prevState,
                latitude: parseFloat(coords[0] || '0'),
                longitude: parseFloat(coords[1] || '0'),
                altitude: parseFloat(coords[2] || '0')
              }
            });
          }

          // Parses the schedule dates for watering the plant.
          let dates: (string | number)[]  = response.data.schedule.split(',');
          dates = dates.map((item: (string | number), index: number) => parseInt(item as string));
          setScheduleData(dates as number[]);
        })
        .catch((e) => {
          console.log(e);
          navigate(`/not-found`, {replace: true});
        });
    };

    fetchPlant();
    // eslint-disable-next-line
  }, [plants]);

  /** Initializes with the correct plant followers data. */
  useEffect(() => {
    if(parseInt(ownerId || '0') !== userId) {
      for(let follower of followedPlants) {
        // Disables requesting for friends more than once.
        if(follower.id === parseInt(plantId || '0')) {
          setAlreadyFollow(true);
          break;
        }
      }
    }
  }, [followedPlants, ownerId, userId, plantId]);

  /** Gets the owner data. */
  useEffect(() => {
    const fetchOwner = () => {
      const url = `${ BASE_URL }user/${ ownerId }`;
      axios.get(url)
        .then((response) => {
          setOwnerData(response.data);
        })
        .catch((e) => {
          console.log(e);
          navigate(`/not-found`, {replace: true});
        });
    };

    fetchOwner();
    // eslint-disable-next-line
  }, []);

  /** Redirects to owner profile. */
  const goToOwner = () => {
    if(parseInt(ownerId || '-1') === userId) navigate(`/collection`, {replace: false});
    else navigate(`/collection/${ownerId}`, {replace: false});
  };

  /** Manages the badges section if the user expands it on mobile devices. */
  const expandGallery = () => {
    setShowGallery(true);
    setShowData(false);
    setShowPublications(false);
  };

  /** Manages the Collection if the user expands it on mobile devices. */
  const expandData = () => {
    setShowGallery(false);
    setShowData(true);
    setShowPublications(false);
  };

  /** Manages the Interactions section if the user expands it on mobile devices. */
  const expandPublications = () => {
    setShowGallery(false);
    setShowData(false);
    setShowPublications(true);
  };

  /** Renders the section selected on mobile devices. */
  const getExpandedSection = () => {
    if(showGallery) return <div className='mobile-section-container'><GalleryPreview imageFiles={['', '', '', '', '']} /> {/* TODO: Pass the correct array of plant images. */}</div>;
    else if(showData) return <div className='mobile-section-container'>{getData()}</div>;
    else if(showPublications) return <div className='mobile-section-container publications'>{ getPublications() }</div>;
  };

  /** Renders the Data of plant including schedules, weather, location, and season. */
  const getData = () => {
    return (
      <>
        <WaterSchedule selectedDates={scheduleData}/>
        <Weather />
        <Location altitude={locationData.altitude} latitude={locationData.latitude} longitude={locationData.longitude}/>
        <Season />
      </>
    );
  };

  /** Renders the publications and posts. Includes section to write new posts. */
  const getPublications = () => {
    return (
      <>
        <section className='publications-container'>
          <Suspense> <NewPost />  </Suspense>
        </section>

        <div className='section-divisor'> </div>

        <section className='publications-container'>
          <Suspense>
            {
              plantData !== undefined && plantData.posts.length > 0?
                plantData.posts.map((item, index) => {
                  return <PublishedPost post={item} key={`published-post-item-${item.id}`} />;
                })
                :
                <div className='not-found-container'> <img src={noContent} alt='No content to show'/> </div>
            }
          </Suspense>
          <h2 className='section-title publications-section-title'>Publications</h2>
        </section>
      </>
    );
  };

  /** For others view, enables asking for following plant. */
  const sendFollow = () => {
    setDisableButton(true);
    const url = `${ BASE_URL }follow-plant`;
    const data = {
      userId: userId,
      plantId: plantId || 0
    };

    axios.post(url, data)
      .then((res) => {
        console.log('Successfully following plant');
        setDisableButton(false);
        setAlreadyFollow(true);
      })
      .catch((e) => {
        console.log(e);
        setDisableButton(false);
      });
  };

  /** For others view, enables unfollowing. */
  const deleteFollow = () => {
    setDisableButton(true);
    const url = `${ BASE_URL }follow-plant/${1}`; // TODO: Correct delete function request

    axios.delete(url)
      .then((res) => {
        console.log('Successfully stopped following user');
        setDisableButton(false);
        setAlreadyFollow(false);
      })
      .catch((e) => {
        console.log(e);
        setDisableButton(false);
      });
  };

  return (
    <main className="plant-profile-page">
      <ProfileHeader plantData={plantHeaderData} view={(plantData?.ownerId || 0) === userId? CollectionView.OWNER : CollectionView.OTHERS} />

      {
        deviceType === DeviceTypes.MOBILE?
          <>
            <div className='collection-option-container'>
              <button className={`button-open-section collection-option ${showGallery? 'selected-collection-option' : ''}`}
                      onClick={expandGallery}
              >
                Gallery
              </button>
              <button className={`button-open-section collection-option ${showData? 'selected-collection-option' : ''}`}
                      onClick={expandData}
              >
                Data
              </button>
              <button className={`button-open-section collection-option ${showPublications? 'selected-collection-option' : ''}`}
                      onClick={expandPublications}
              >
                Publications
              </button>
            </div>

            { getExpandedSection() }
          </>
          :
          <>
            <div className='plant-profile-data-container'>
              { getData() }
            </div>

            <div className='page-content-container'>
              <section className='publications-container'>
                <GalleryPreview imageFiles={['', '', '', '', '']} /> {/* TODO: Pass the correct array of plant images. */}
              </section>

              { getPublications() }
            </div>

            <div className='owner-data-container'>
              {
                parseInt(ownerId || '0') !== userId?
                  <button className={`button-open-section`}
                          onClick={alreadyFollow? deleteFollow : sendFollow}
                          disabled={disableButton}
                  >
                    {alreadyFollow? 'Unfollow' : 'Follow'}
                  </button>
                  :
                  ''
              }

              <DataSection title={'Owned by'} onClickSection={() => {}}>
                <div className='list-item-container' onClick={goToOwner} >
                  <div className='list-img-container'>
                    <LazyLoadImage src={CheckEncodedImage(ownerData?.imageFile || '')? ownerData?.imageFile : defaultPerson} alt={`Owner`} />
                  </div>
                  {
                    ownerData?.name !== undefined?
                      <p> {ownerData.name.charAt(0).toUpperCase() + ownerData.name.substring(1)} </p>
                      :
                      ''
                  }
                </div>
              </DataSection>
            </div>
          </>
      }
    </main>
  );
}

export default PlantProfile;