import React, {useState} from 'react';
import DataSection from "../components/DataSection";
import {LazyLoadImage} from "react-lazy-load-image-component";
import treeImg from "../assets/category-tree.jpeg";
import Modal from "./Modal";

export interface IBadgesProps {
  totalBadges: number,
  badgePreviewIds: number[]
}

const Badges: React.FunctionComponent<IBadgesProps> = ({totalBadges, badgePreviewIds}) => {
  const [badgesData, setBadgesData] = useState<{name: string, id: number}[]>([]);
  const [expanded, setExpanded] = useState(false);

  /** Fetches the whole Badges data only when the section is expanded. */
  const openSection = () => {
    // Avoids querying the DB if the data is already hold.
    if(badgesData.length === 0) fetchBadgesData();

    setExpanded(true);
  };

  /** Closes the modal. */
  const closeSection = () => {
    setExpanded(false);
  };

  const fetchBadgesData = () => {
    // TODO: Fetch the full associated data.
    setBadgesData([
      {name: 'Badge A', id: 1},
      {name: 'Badge B', id: 2},
      {name: 'Badge C', id: 3},
      {name: 'Badge D', id: 4},
      {name: 'Badge E', id: 5},
      {name: 'Badge F', id: 6},
      {name: 'Badge G', id: 7},
      {name: 'Badge H', id: 8},
    ]);
  };

  return (
    <div className='collection-badges'>
      <DataSection title='Badges' totalItems={totalBadges} onClickSection={openSection}>
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

        {
          expanded?
            <Modal onClose={closeSection}>
              <h2 className='section-title-modal'>Badges ({totalBadges})</h2>
              {
                // TODO: Add the correct img assets.
                badgesData.map((item, index) => {
                  return (
                    <div className='list-item-container' key={`list-item-${item.name.toLowerCase()}`}>
                      <div className='list-img-container'>
                        <LazyLoadImage src={treeImg} alt={`Badge ${item.name}`} />
                      </div>
                      <p> {item.name.charAt(0).toUpperCase() + item.name.substring(1)} </p>
                    </div>
                  );
                })
              }
            </Modal>
            :
            ''
        }
      </DataSection>
    </div>
  );
}

export default Badges;