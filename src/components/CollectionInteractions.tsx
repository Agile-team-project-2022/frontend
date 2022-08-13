import React, {useContext, useEffect, useState} from 'react';
import './CollectionInteractions.css';
import {LazyLoadImage} from "react-lazy-load-image-component";
import treeImg from "../assets/category-tree.jpeg";
import DataSection from './DataSection';
import Modal from "./Modal";
import {DeviceTypes} from "../hooks/useWindowSize";
import {AppContext, ThumbnailData} from "../context";

export interface ICollectionInteractionsProps {}

export enum SectionType {
  PLANT = 'PLANT',
  PERSON = 'PERSON'
}

const CollectionInteractions: React.FunctionComponent<ICollectionInteractionsProps> = (props) => {
  const {state: {deviceType, userData}} = useContext(AppContext);

  // TODO: Hardcoded. Must be replaced with the endpoint. Check if it will be implemented in backend or will be pending.
  const [carePlants, setCarePlants] = useState<{id: number, name: string, imageFile: string}[]>([]);
  const [carePlantsPending, setCarePlantsPending] = useState<{id: number, name: string, imageFile: string}[]>([]);
  const [expandedCarePlants, setExpandedCarePlants] = useState(false);
  const [expandedCarePlantsPending, setExpandedCarePlantsPending] = useState(false);

  const [friends, setFriends] = useState<{id: number, name: string, imageFile: string}[]>([]);
  const [friendsPending, setFriendsPending] = useState<{id: number, name: string, imageFile: string}[]>([]);
  const [expandedFriends, setExpandedFriends] = useState(false);
  const [expandedFriendsPending, setExpandedFriendsPending] = useState(false);

  useEffect(() => {
    // TODO: Must be replaced with the endpoint.
    // TODO: Include preview arrays too.
    setCarePlants([
      {id: 1, name: 'plant A', imageFile: ''},
      {id: 2, name: 'plant B', imageFile: ''},
      {id: 3, name: 'plant C', imageFile: ''}
    ]);

    setCarePlantsPending(
      userData.followedPlants // TODO: use correct data.
    );

    setFriends([
      {id: 1, name: 'person 1', imageFile: ''},
      {id: 2, name: 'person 2', imageFile: ''},
      {id: 3, name: 'person 3', imageFile: ''},
      {id: 4, name: 'person 4', imageFile: ''}
    ]);

    setFriendsPending([
      {id: 4, name: 'person A', imageFile: ''},
      {id: 5, name: 'person B', imageFile: ''}
    ]);
  }, [userData.followedPlants]);

  /** Opens the respective modal. */
  const openSectionCarePlants = () => {
    setExpandedCarePlants(true);
  };

  const openSectionCarePlantsPending = () => {
    setExpandedCarePlantsPending(true);
  };

  const openSectionFriends = () => {
    setExpandedFriends(true);
  };

  const openSectionFriendsPending = () => {
    setExpandedFriendsPending(true);
  };

  /** Closes the modals. */
  const closeSectionCarePlants = () => {
    setExpandedCarePlants(false);
  };

  const closeSectionCarePlantsPending = () => {
    setExpandedCarePlantsPending(false);
  };

  const closeSectionFriends = () => {
    setExpandedFriends(false);
  };

  const closeSectionFriendsPending = () => {
    setExpandedFriendsPending(false);
  };

  /** Renders the section depending on the interaction. */
  const getSection = (
    title: string,
    sectionType: SectionType,
    array: ThumbnailData[],
    modalIsOpen: boolean,
    onOpenSection: () => void,
    onCloseSection: () => void
  ) => {
    return (
      <DataSection title={title} totalItems={array.length} onClickSection={onOpenSection}>
        {
          array.map((item, index) => {
            return (
              <div className={`list-img-container ${sectionType === SectionType.PLANT? 'squared-img' : ''}`} key={`item-interaction-${item.name}-${item.id}`}>
                <LazyLoadImage src={treeImg} alt={'Interaction'} />
              </div>
            );
          })
        }

        {
          modalIsOpen?
            <Modal onClose={onCloseSection}>
              <h2 className='section-title-modal'>{title} ({array.length})</h2>
              {
                // TODO: Add the correct img assets.
                array.map((item, index) => {
                  return (
                    <div className='list-item-container' key={`list-item-interaction-${item.name}-${item.id}`}>
                      <div className='list-img-container'>
                        <LazyLoadImage src={treeImg} alt={'Interaction'} />
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
    );
  };

  return (
    <div className="collection-interactions">
      <div className={`${deviceType === DeviceTypes.MOBILE? 'mobile-section-container' : ''}`}>
        {
          getSection(
            'Requests for taking care',
            SectionType.PLANT,
            carePlantsPending, // TODO: fetch from endpoint the correct data.
            expandedCarePlantsPending,
            openSectionCarePlantsPending,
            closeSectionCarePlantsPending
          )
        }

        {
          getSection(
            'Friend requests',
            SectionType.PERSON,
            friendsPending, // TODO: fetch from endpoint
            expandedFriendsPending,
            openSectionFriendsPending,
            closeSectionFriendsPending
          )
        }
      </div>

      <div className={`${deviceType === DeviceTypes.MOBILE? 'mobile-section-container' : ''}`}>
        {
          getSection(
            'Currently taking care for',
            SectionType.PLANT,
            carePlants, // TODO: fetch from endpoint
            expandedCarePlants,
            openSectionCarePlants,
            closeSectionCarePlants
          )
        }

        {
          getSection(
            'Friends',
            SectionType.PERSON,
            friends, // TODO: fetch from endpoint
            expandedFriends,
            openSectionFriends,
            closeSectionFriends
          )
        }
      </div>
    </div>
  );
}

export default CollectionInteractions;