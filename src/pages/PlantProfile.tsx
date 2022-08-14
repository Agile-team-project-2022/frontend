import React, {Suspense, useContext, useEffect, useState} from 'react';
import './PlantProfile.css';
import './Home.css';
import {useParams} from "react-router-dom";
import {CollectionView} from "../components/CollectionHeader";
import ProfileHeader, {PlantHeaderData} from "../components/ProfileHeader";
import {AppContext, PlantData} from "../context";
import axios from "axios";
import PublishedPost from "../components/PublishedPost";
import NewPost from "../components/NewPost";
import GalleryPreview from "../components/GalleryPreview";
import WaterSchedule from "../components/WaterSchedule";
import Badges from "../components/Badges";
import CollectionPlants from "../components/CollectionPlants";
import CollectionInteractions from "../components/CollectionInteractions";
import {DeviceTypes} from "../hooks/useWindowSize";

export interface IPlantProfileProps {}

const PlantProfile: React.FunctionComponent<IPlantProfileProps> = () => {
  const {plantId, ownerId} = useParams();
  const {state: {userData: {plants}, deviceType, BASE_URL}} = useContext(AppContext);
  const [plantData, setPlantData] = useState<PlantData>();
  const [plantHeaderData, setPlantHeaderData] = useState<PlantHeaderData>({id: -1, name: '', imageFile: '', species: '', followers: 0});
  // Manages the sections to expand on mobile devices.
  const [showGallery, setShowGallery] = useState(true);
  const [showData, setShowData] = useState(false);
  const [showPublications, setShowPublications] = useState(false);

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
        })
        .catch((e) => console.log(e));
    };

    fetchPlant();
    // eslint-disable-next-line
  }, [plants]);

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
    else if(showData) return <div className='mobile-section-container'><WaterSchedule /></div>;
    else if(showPublications) return <div className='mobile-section-container'>{ getPublications() }</div>;
  };

  /** Renders the publications and posts. */
  const getPublications = () => {
    return (
      <>
        <Suspense>
          {
            plantData !== undefined && plantData.posts.length > 0?
              plantData.posts.map((item, index) => {
                return <PublishedPost post={item} key={`published-post-item-${item.id}`} />;
              })
              :
              <p> No Posts to show yet for owner Id: {ownerId} </p>
          }
        </Suspense>
        <h2 className='section-title publications-section-title'>Publications</h2>
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
              <WaterSchedule />
            </div>

            <div className='page-content-container'>
              <section className='publications-container'>
                <GalleryPreview imageFiles={['', '', '', '', '']} /> {/* TODO: Pass the correct array of plant images. */}
              </section>

              <section className='publications-container'>
                <Suspense> <NewPost />  </Suspense>
              </section>

              <div className='section-divisor'> </div>

              <section className='publications-container'>
                { getPublications() }
              </section>
            </div>

            <div> More data </div>
          </>
      }
    </main>
  );
}

export default PlantProfile;