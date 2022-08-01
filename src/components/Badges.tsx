import React, {useEffect, useState} from 'react';
import DataSection from "../components/DataSection";
import {LazyLoadImage} from "react-lazy-load-image-component";
import treeImg from "../assets/category-tree.jpeg";

export interface IBadgesProps {
  totalBadges: number,
  badgePreviewIds: number[]
}

const Badges: React.FunctionComponent<IBadgesProps> = ({totalBadges, badgePreviewIds}) => {
  const [badgesData, setBadgesData] = useState<{name: string, id: number}[]>([]);

  const handleClickSection = () => {

  };

  return (
    <div className='collection-badges'>
      <DataSection title='Badges' totalItems={totalBadges} onClickSection={handleClickSection} >
        <>
          {
            // TODO: Add the correct img assets.
            badgePreviewIds.map((item, index) => {
              return (
                <div className='list-img-container' key={`item-badges-${item}`}>
                  <LazyLoadImage src={treeImg} alt={`Badge`} />
                </div>
              );
            })
          }
        </>
      </DataSection>
    </div>
  );
}

export default Badges;