import React, {lazy, Suspense, useContext, useEffect} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./layouts/Header";
import {AppContext, AppValidActions} from "./context";
import useWindowSize, {DeviceTypes} from "./hooks/useWindowSize";
import axios from "axios";
import PlantProfile from "./pages/PlantProfile";
import NotFound from "./components/NotFound";
import {getExperience} from "./helpers";

const Home = lazy(() => import('./pages/Home'));
const Collection = lazy(() => import('./pages/Collection'));
const Login = lazy(() => import('./components/Login'));

export interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (props) => {
  const {state, dispatch} = useContext(AppContext);
  const {deviceType} = useWindowSize();

  useEffect(() => {
    // Updates the context only if the device type changed.
    if(state.deviceType !== deviceType) {
      dispatch({type: AppValidActions.SET_DEVICE_TYPE, payload: {deviceType: deviceType || DeviceTypes.DESKTOP}});
    }
    // eslint-disable-next-line
  }, [deviceType]);

  /** Gets and saves the user data only if it is not already saved. */
  useEffect(() => {
    /** Fetches the user data and marks it as already 'updated' to avoid future unnecessary queries. */
    const fetchUserData = () => {
      const url = `${ state.BASE_URL }user/${ state.userData.userId }`;

      axios.get(url)
        .then((response) => {
          // Prepares list of incoming and out friends.
          const outFriends = response.data.follower.map((item: any) => {
            return {
              ...item.followee,
              accepted: item.accepted
            }
          });
          const inFriends = response.data.following.map((item: any) => {
            return {
              ...item.follower,
              accepted: item.accepted
            }
          });
          const pendingFriends = inFriends.filter((item: any) => !item.accepted);
          const friends = [...inFriends.filter((item: any) => item.accepted), ...outFriends.filter((item: any) => item.accepted)];

          const data = {
            updated: true,
            user: response.data.name,
            name: response.data.name,
            email: response.data.email,
            imageFile: response.data.imageFile,
            experience: getExperience(
              response.data._count.plants,
              response.data._count.follower,
              response.data._count.posts
            ),
            typePlanter: response.data.planter_type,
            plants: response.data.plants,
            followedPlants: response.data.Plantsfollow.map((item: any) => item.plant),
            friends: friends,
            pendingFriends: pendingFriends,
            posts: response.data.posts,
            count: {
              totalPlants: response.data._count.plants,
              totalFriends: response.data._count.follower,
              totalFollowedPlants: response.data._count.Plantsfollow,
              totalPosts: response.data._count.posts
            },
            createdAt: response.data.createdAt
          };

          dispatch({type: AppValidActions.SET_USER_DATA, payload: {userData: data}});
        })
        .catch((e) => console.log(e));
    };

    /** Gets all the Posts data only for the first time or when the plants change. */
    const fetchAllPosts = () => { // TODO: adjust count and page limits
      const url = `${ state.BASE_URL }post?page=1&count=100`;
      axios.get(url)
        .then((response) => {
          dispatch({type: AppValidActions.UPDATE_HOME_POSTS, payload: {homePosts: response.data}});
        })
        .catch((e) => console.log(e));
    };

    fetchUserData();
    fetchAllPosts();
    // eslint-disable-next-line
  }, [state.updateFetchUser]);

  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <BrowserRouter>
      <Header />

      {/* TODO: Design a Loading component to render in the meanwhile. */}
      <Suspense fallback={<span>Loading...</span>}>
        { state.showLogIn? <Login/> : ''}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="collection/:ownerId" element={<Collection />} />
          <Route path="collection" element={<Collection />} />
          <Route path="plant-profile/:plantId/:ownerId" element={<PlantProfile />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>

      <button className='arrow-button top-arrow' onClick={scrollTop} >
        <div> </div>
        <div> </div>
      </button>
    </BrowserRouter>
  );
}

export default App;

