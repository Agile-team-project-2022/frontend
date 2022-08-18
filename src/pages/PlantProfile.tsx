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

export interface IPlantProfileProps {}

const PlantProfile: React.FunctionComponent<IPlantProfileProps> = () => {
  const {plantId, ownerId} = useParams();
  const {state: {deviceType, BASE_URL}} = useContext(AppContext);
  const [plantData, setPlantData] = useState<PlantData>();
  const [ownerData, setOwnerData] = useState<UserData>();
  const [locationData, setLocationData] = useState({altitude: 0, latitude: 0, longitude: 0});
  const [scheduleData, setScheduleData] = useState<number[]>([]);
  const [plantHeaderData, setPlantHeaderData] = useState<PlantHeaderData>({id: -1, name: '', imageFile: '', species: '', followers: 0});
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
            followers: response.data.followers?.length || 0
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
  }, []);

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
    navigate(`/collection`, {replace: false});
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

  return (
    <main className="plant-profile-page">
      <ProfileHeader plantData={plantHeaderData} view={CollectionView.OWNER} />

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
              <DataSection title={'Owned by'} onClickSection={() => {}}>
                <div className='list-item-container' onClick={goToOwner} >
                  <div className='list-img-container'>
                    <LazyLoadImage src={ownerData?.imageFile || defaultPerson} alt={`Owner`} />
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