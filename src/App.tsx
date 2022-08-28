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

  /** Retrieves the login data if available. */
  useEffect(() => {
    // window.localStorage.removeItem('InterPlantSessionData') TODO: remove after completing login.
    const data = window.localStorage.getItem('InterPlantSessionData');
    if(data) {
      const loginData = JSON.parse(data);
      dispatch({type: AppValidActions.LOG_IN, payload: {
        userId: loginData.userId,
        user: loginData.name,
        token: loginData.token
      }});
    }
    // eslint-disable-next-line
  }, []);

  /** Uses the login data when received. */
  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
  }, [state.token]);

  /** Updates the context only if the device type changed. */
  useEffect(() => {
    if(state.deviceType !== deviceType) {
      dispatch({type: AppValidActions.SET_DEVICE_TYPE, payload: {deviceType: deviceType || DeviceTypes.DESKTOP}});
    }
    // eslint-disable-next-line
  }, [deviceType]);

  /** Gets and saves the user data only if it is not already saved. */
  useEffect(() => {
    /** Fetches the user data if logged in and marks it as already 'updated' to avoid future unnecessary queries. */
    if(state.token === '') return;

    const fetchUserData = () => {
      const url = `${ state.BASE_URL }user/${ state.userData.userId }`;
      dispatch({type: AppValidActions.UPDATE_USER_LOADING, payload: {loading: true}});
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
          dispatch({type: AppValidActions.UPDATE_USER_LOADING, payload: {loading: false}});
        })
        .catch((e) => {
          console.log(e);
          if(e.message !== 'Network Error') dispatch({type: AppValidActions.UPDATE_USER_LOADING, payload: {loading: false}});
        });
    };

    fetchUserData();
    // eslint-disable-next-line
  }, [state.updateFetchUser, state.token]);

  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <BrowserRouter>
      <Header />

      <Suspense>
        { state.showLogIn? <Login/> : ''}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="collection/:ownerId/confirm-friend/:relationId" element={<Collection confirm={true} />} />
          <Route path="collection/:ownerId" element={<Collection />} />
          <Route path="collection" element={<Collection />} />
          <Route path="plant-profile/:plantId/:ownerId" element={<PlantProfile />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>

      <button className='arrow-button top-arrow' onClick={scrollTop} aria-label='Scroll top' >
        <div> </div>
        <div> </div>
      </button>
    </BrowserRouter>
  );
}

export default App;

