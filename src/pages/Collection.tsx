import React, {useContext, useEffect, useState} from 'react';
import './Collection.css';
import CollectionHeader, {CollectionView} from "../components/CollectionHeader";
import CollectionPlants from "../components/CollectionPlants";
import Badges from "../components/Badges";
import {AppContext, AppValidActions, UserData} from "../context";
import {DeviceTypes} from "../hooks/useWindowSize";
import CollectionInteractions from "../components/CollectionInteractions";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {getExperience} from "../helpers";
import Loading from "../components/Loading";

export interface ICollectionProps {
  confirm? : boolean
}

const Collection: React.FunctionComponent<ICollectionProps> = ({confirm}) => {
  const {state: {deviceType, userData, BASE_URL, loadingUser}, dispatch} = useContext(AppContext);
  const {ownerId, relationId} = useParams();
  const [view, setView] = useState(CollectionView.OWNER);
  const [othersData, setOthersData] = useState<UserData>();
  const [ownerTotalBadges, setOwnerTotalBadges] = useState(0);
  // Manages the sections to expand on mobile devices.
  const [showBadges, setShowBadges] = useState(true);
  const [showCollection, setShowCollection] = useState(false);
  const [showInteractions, setShowInteractions] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const navigate = useNavigate();

  // Determines the type of viewer.
  useEffect(() => {
    if(ownerId && parseInt(ownerId) !== userData.userId) setView(CollectionView.OTHERS);
    else setView(CollectionView.OWNER);
  }, [userData.userId, ownerId]);

  useEffect(() => {
    /** Fetches the user data only for Others view. */
    const fetchUserData = () => {
      const url = `${ BASE_URL }user/${ ownerId }`;
      setLoadingData(true);
      axios.get(url)
        .then((response) => {
          // Prepares list of incoming and out friends.
          const outFriends = response.data.follower.map((item: any) => {
            return {
              ...item.followee,
              accepted: item.accepted,
              relationId: item.id
            }
          });
          const inFriends = response.data.following.map((item: any) => {
            return {
              ...item.follower,
              accepted: item.accepted,
              relationId: item.id
            }
          });
          const pendingFriends = inFriends.filter((item: any) => !item.accepted);
          const friends = [...inFriends.filter((item: any) => item.accepted), ...outFriends.filter((item: any) => item.accepted)];

          const data = {
            userId: response.data.id,
            name: response.data.name,
            imageFile: response.data.imageFile,
            friends: friends,
            pendingFriends: pendingFriends,
            typePlanter: response.data.planter_type,
            experience: getExperience(
              response.data._count.plants,
              response.data._count.follower,
              response.data._count.posts
            ),
            plants: response.data.plants,
            createdAt: response.data.createdAt,
            count: {
              totalPlants: response.data._count.plants,
              totalFriends: response.data._count.follower,
              totalFollowedPlants: response.data._count.Plantsfollow,
              totalPosts: response.data._count.posts
            }
          };

          setOthersData(data as UserData);
          setLoadingData(false);
        })
        .catch((e) => {
          if(e.message.includes('Request failed with status code 401')) {
            dispatch({type: AppValidActions.LOG_OUT});
            if(!window.location.href.includes('/home')) {
              navigate(`/home`, {replace: true});
            }
          }
          else if(e.message !== 'Network Error') navigate(`/not-found`, {replace: true});
          else console.log(e);
        });
    };

    if(view === CollectionView.OTHERS && ownerId && parseInt(ownerId) !== userData.userId) fetchUserData();
    // eslint-disable-next-line
  }, [ownerId, BASE_URL, view]);

  /** Manages the badges section if the user expands it on mobile devices. */
  const expandBadges = () => {
    setShowBadges(true);
    setShowCollection(false);
    setShowInteractions(false);
  };

  /** Manages the Collection if the user expands it on mobile devices. */
  const expandCollection = () => {
    setShowBadges(false);
    setShowCollection(true);
    setShowInteractions(false);
  };

  /** Manages the Interactions section if the user expands it on mobile devices. */
  const expandInteractions = () => {
    setShowBadges(false);
    setShowCollection(false);
    setShowInteractions(true);
  };

  /** Updates the count of badges. */
  const updateBadgeCount = (count: number) => {
    setOwnerTotalBadges(count);
  };

  /** Renders the section selected on mobile devices. */
  const getExpandedSection = () => {
    if(showBadges) {
      return (
        <div className='mobile-section-container'>
          <Badges totalPlants={view === CollectionView.OWNER? userData.count.totalPlants : othersData?.count.totalPlants || 0}
                  totalFriends={view === CollectionView.OWNER? userData.friends.length : othersData?.friends.length || 0}
                  totalPosts={view === CollectionView.OWNER? userData.count.totalPosts : othersData?.count.totalPosts || 0}
                  updateOwnerBadges={updateBadgeCount}
          />
        </div>
      );
    } else if(showCollection) {
      return (
        <div className='mobile-section-container'>
          <CollectionPlants ownerId={view === CollectionView.OWNER? userData.userId : (ownerId || '')}
                            plants={view === CollectionView.OWNER? userData.plants : othersData?.plants || []}
                            totalPlants={view === CollectionView.OWNER? userData.count.totalPlants : othersData?.count.totalPlants || 0}
                            view={view}
          />
        </div>
      );
    } else if(showInteractions) {
      return (
        <CollectionInteractions friends={view === CollectionView.OWNER? userData.friends : othersData?.friends || []}
                                friendsPending={view === CollectionView.OWNER? userData.pendingFriends : othersData?.pendingFriends || []}
                                view={view}
        />
      );
    }
  };

  return (
    <main className="collection-page">
      <CollectionHeader othersData={othersData}
                        view={view}
                        totalBadges={ownerTotalBadges}
                        confirm={confirm}
                        relationId={relationId}
      />

      {
        deviceType === DeviceTypes.MOBILE?
          <>
            <div className='collection-option-container'>
              <button className={`button-open-section collection-option ${showBadges? 'selected-collection-option' : ''}`}
                      onClick={expandBadges}
              >
                Badges
              </button>
              <button className={`button-open-section collection-option ${showCollection? 'selected-collection-option' : ''}`}
                      onClick={expandCollection}
              >
                Collection
              </button>
              <button className={`button-open-section collection-option ${showInteractions? 'selected-collection-option' : ''}`}
                      onClick={expandInteractions}
              >
                Interactions
              </button>
            </div>

            { getExpandedSection() }
          </>
          :
          <>
            <Badges totalPlants={view === CollectionView.OWNER? userData.count.totalPlants : othersData?.count.totalPlants || 0}
                    totalFriends={view === CollectionView.OWNER? userData.friends.length : othersData?.friends.length || 0}
                    totalPosts={view === CollectionView.OWNER? userData.count.totalPosts : othersData?.count.totalPosts || 0}
                    updateOwnerBadges={updateBadgeCount}
            />

            <CollectionPlants ownerId={ownerId || userData.userId}
                              plants={view === CollectionView.OWNER? userData.plants : othersData?.plants || []}
                              totalPlants={view === CollectionView.OWNER? userData.count.totalPlants : othersData?.count.totalPlants || 0}
                              view={view}
            />

            <CollectionInteractions friends={view === CollectionView.OWNER? userData.friends : othersData?.friends || []}
                                    friendsPending={view === CollectionView.OWNER? userData.pendingFriends : othersData?.pendingFriends || []}
                                    view={view}
                                    confirm={confirm}
                                    relationId={relationId}
                                    othersId={parseInt(ownerId || '0')}
            />
          </>
      }

      { loadingData || loadingUser? <Loading className='full-page-loading' /> : '' }
    </main>
  );
}

export default Collection;