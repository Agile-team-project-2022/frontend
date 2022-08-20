import React, {useContext, useEffect, useState} from 'react';
import DataSection from "../components/DataSection";
import {LazyLoadImage} from "react-lazy-load-image-component";
import Modal from "./Modal";
import {AppContext} from "../context";
import {DeviceTypes} from "../hooks/useWindowSize";
import {getBadges} from "../helpers";

export interface IBadgesProps {
  totalPlants: number,
  totalFriends: number,
  totalPosts: number,
  updateOwnerBadges: (count: number) => void
}

const Badges: React.FunctionComponent<IBadgesProps> = ({totalPlants, totalFriends, totalPosts, updateOwnerBadges}) => {
  const {state: {deviceType}} = useContext(AppContext);
  const [expanded, setExpanded] = useState(false);
  const [totalBadges, setTotalBadges] = useState(0);
  const [previewBadges, setPreviewBadges] = useState<string[]>([]);
  const [badges, setBadges] = useState<{name: string, imageFile: string}[]>([]);

  /** Assigns the whole Badges data only once. */
  useEffect(() => {
    CalculateBadgesData();
    // eslint-disable-next-line
  }, [totalPlants, totalFriends, totalPosts]);

  const openSection = () => {
    setExpanded(true);
  };

  /** Closes the modal. */
  const closeSection = () => {
    setExpanded(false);
  };

  /** Based on the user data, calculates the assigned badges. */
  const CalculateBadgesData = () => {
    const calculatedBadges = getBadges(
      totalPlants,
      totalFriends,
      totalPosts
    );

    const countBadges = calculatedBadges.length;
    const threshold = deviceType === DeviceTypes.MOBILE? 20 : 5;
    const prevBadges: string[] = [];
    for(let i = 0; i < Math.min(threshold, countBadges); i++) {
      prevBadges.push(calculatedBadges[i].imageFile);
    }

    setBadges(calculatedBadges);
    setTotalBadges(countBadges);
    setPreviewBadges(prevBadges);
    updateOwnerBadges(countBadges);
  };

  return (
    <div className='collection-badges'>
      <DataSection title='Badges' totalItems={totalBadges} onClickSection={openSection}>
        {
          previewBadges.map((item, index) => {
            return (
              <div className='list-img-container' key={`item-badges-${index}`}>
                <LazyLoadImage src={item} alt={`Badge`} />
              </div>
            );
          })
        }

        {
          expanded?
            <Modal onClose={closeSection}>
              <h2 className='section-title-modal'>Badges ({totalBadges})</h2>
              {
                badges.map((item, index) => {
                  return (
                    <div className='list-item-container' key={`list-item-${index}`}>
                      <div className='list-img-container'>
                        <LazyLoadImage src={item.imageFile} alt={`Badge ${item.name}`} />
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