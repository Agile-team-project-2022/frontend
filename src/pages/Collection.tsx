import React, {useEffect, useState} from 'react';
import './Collection.css';
import CollectionHeader from "../components/CollectionHeader";
import CollectionPlants from "../components/CollectionPlants";
import DataSection from "../components/DataSection";
import {LazyLoadImage} from "react-lazy-load-image-component";
import treeImg from "../assets/category-tree.jpeg";
import Badges from "../components/Badges";

export interface ICollectionProps {}

const Collection: React.FunctionComponent<ICollectionProps> = (props) => {
  const [badges, setBadges] = useState<number[]>([]);
  const [totalBadges, setTotalBadges] = useState(0);

  {/* TODO: Fetch correct user data. */}
  useEffect(() => {
    // TODO: Only fetch name of first 5.
    setBadges([1, 2, 3, 4, 5]);
    setTotalBadges(8);


  }, []);

  return (
    <main className="collection-page">
      <CollectionHeader />
      {/* TODO: Fetch badges of user. */}
      <Badges totalBadges={totalBadges} badgePreviewIds={badges} />

      <CollectionPlants />
      <div className='collection-interactions'>
        Interactions
      </div>
    </main>
  );
}

export default Collection;