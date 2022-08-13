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

export interface IPlantProfileProps {}

const PlantProfile: React.FunctionComponent<IPlantProfileProps> = () => {
  const {plantId, ownerId} = useParams();
  const {state: {userData: {plants}, BASE_URL}} = useContext(AppContext);
  const [plantData, setPlantData] = useState<PlantData>();
  const [plantHeaderData, setPlantHeaderData] = useState<PlantHeaderData>({id: -1, name: '', imageFile: '', species: '', followers: 0});

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

  return (
    <main className="plant-profile-page">
      <ProfileHeader plantData={plantHeaderData} view={CollectionView.OWNER} />

      <div> </div>

      <div className='page-content-container'>
        <section className='publications-container'>
          <GalleryPreview imageFiles={['', '', '', '', '']} /> {/* TODO: Pass the correct array of plant images. */}
        </section>

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
                <p> No Posts to show yet for owner Id: {ownerId} </p>
            }
          </Suspense>
          <h2 className='section-title publications-section-title'>Publications</h2>
        </section>
      </div>

      <div> </div>
    </main>
  );
}

export default PlantProfile;