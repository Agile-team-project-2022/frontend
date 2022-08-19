import React, {lazy, Suspense, useContext, useState} from 'react';
import './CollectionInteractions.css';
import {LazyLoadImage} from "react-lazy-load-image-component";
import defaultPersonImg from "../assets/default-person.jpeg";
import DataSection from './DataSection';
import Modal from "./Modal";
import {DeviceTypes} from "../hooks/useWindowSize";
import {AppContext, ThumbnailData} from "../context";
import {CollectionView} from "./CollectionHeader";
import {CheckEncodedImage} from "../helpers";
import {useNavigate} from "react-router-dom";
import {ListType} from "./ExpandedList";
import axios from "axios";

const ExpandedList = lazy(() => import('../components/ExpandedList'));

export interface ICollectionInteractionsProps {
  view: CollectionView
  friends: ThumbnailData[],
  friendsPending: ThumbnailData[],
  othersId?: number
}

export enum SectionType {
  PLANT = 'PLANT',
  PERSON = 'PERSON'
}

const CollectionInteractions: React.FunctionComponent<ICollectionInteractionsProps> = ({view, friends, friendsPending, othersId}) => {
  const {state: {deviceType, BASE_URL, userData: {userId}}} = useContext(AppContext);
  const [expandedFriends, setExpandedFriends] = useState(false);
  const [expandedFriendsPending, setExpandedFriendsPending] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [alreadyFriends, setAlreadyFriends] = useState(false);
  const navigate = useNavigate();

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

  /** For others view, enables asking for being friends. */
  const sendFriendRequest = () => {
    setDisableButton(true);
    const url = `${ BASE_URL }follow-friend`;
    const data = {
      followerId: userId,
      followeeId: othersId || 0
    };

    axios.post(url, data)
      .then((res) => {
        console.log('Successfully following user');
        setDisableButton(false);
        setAlreadyFriends(true);
      })
      .catch((e) => {
        console.log(e);
        setDisableButton(false);
      });
  };

  /** For others view, enables stopping being friends. */
  const deleteFriends = () => {
    setDisableButton(true);
    const url = `${ BASE_URL }follow-friend/${1}`; // TODO: Correct delete function request

    axios.delete(url)
      .then((res) => {
        console.log('Successfully stopped following user');
        setDisableButton(false);
        setAlreadyFriends(false);
      })
      .catch((e) => {
        console.log(e);
        setDisableButton(false);
      });
  };

  /** Goes to the owner profile when clicked on the friends section. */
  const goToOwner = (id: number) => {
    closeSectionFriends();
    closeSectionFriendsPending();
    navigate(`/collection/${id}`, {replace: false});
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
              <div className={`list-img-container ${sectionType === SectionType.PLANT? 'squared-img' : ''}`}
                   key={`item-interaction-${item.name}-${item.id}`}
                   onClick={() => goToOwner(item.id)}
              >
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
                    <div className='list-item-container'
                         key={`list-item-interaction-${item.name}-${item.id}`}
                         onClick={() => goToOwner(item.id)}
                    >
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
          <Suspense>
            <ExpandedList title='Plants you Follow' type={ListType.FOLLOWED_PLANTS} />
          </Suspense>
          :
          <>
            {
              deviceType === DeviceTypes.MOBILE?
                ''
                :
                <button className={`button-open-section`}
                        onClick={alreadyFriends? deleteFriends : sendFriendRequest}
                        disabled={disableButton}
                >
                  {alreadyFriends? 'Delete friend' : 'Friend request'}
                </button>
            }
          </>
      }

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