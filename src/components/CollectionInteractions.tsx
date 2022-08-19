import React, {useContext, useState} from 'react';
import './CollectionInteractions.css';
import {LazyLoadImage} from "react-lazy-load-image-component";
import defaultPersonImg from "../assets/default-person.jpeg";
import DataSection from './DataSection';
import Modal from "./Modal";
import {DeviceTypes} from "../hooks/useWindowSize";
import {AppContext, ThumbnailData} from "../context";
import {CollectionView} from "./CollectionHeader";
import {CheckEncodedImage} from "../helpers";

export interface ICollectionInteractionsProps {
  view: CollectionView
  friends: ThumbnailData[],
  friendsPending: ThumbnailData[]
}

export enum SectionType {
  PLANT = 'PLANT',
  PERSON = 'PERSON'
}

const CollectionInteractions: React.FunctionComponent<ICollectionInteractionsProps> = ({view, friends, friendsPending}) => {
  const {state: {deviceType}} = useContext(AppContext);
  const [expandedFriends, setExpandedFriends] = useState(false);
  const [expandedFriendsPending, setExpandedFriendsPending] = useState(false);

  /** Opens the respective modal. */
  const openSectionFriends = () => {
    setExpandedFriends(true);
  };

  const openSectionFriendsPending = () => {
    setExpandedFriendsPending(true);
  };

  /** Closes the modals. */
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
                <LazyLoadImage src={CheckEncodedImage(item.imageFile)? item.imageFile : defaultPersonImg} alt={'Person'} />
              </div>
            );
          })
        }

        {
          modalIsOpen?
            <Modal onClose={onCloseSection}>
              <h2 className='section-title-modal'>{title} ({array.length})</h2>
              {
                array.map((item, index) => {
                  return (
                    <div className='list-item-container' key={`list-item-interaction-${item.name}-${item.id}`}>
                      <div className='list-img-container'>
                        <LazyLoadImage src={CheckEncodedImage(item.imageFile)? item.imageFile : defaultPersonImg} alt={'Person'} />
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
      {
        view === CollectionView.OWNER?
          <div className={`${deviceType === DeviceTypes.MOBILE? 'mobile-section-container' : ''}`}>
            {
              getSection(
                'Friend requests',
                SectionType.PERSON,
                friendsPending,
                expandedFriendsPending,
                openSectionFriendsPending,
                closeSectionFriendsPending
              )
            }
          </div>
          :
          ''
      }

      <div className={`${deviceType === DeviceTypes.MOBILE? 'mobile-section-container' : ''}`}>
        {
          getSection(
            'Friends',
            SectionType.PERSON,
            friends,
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