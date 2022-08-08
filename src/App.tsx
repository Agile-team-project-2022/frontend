import React, {lazy, Suspense, useContext, useEffect} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./layouts/Header";
import {AppContext, AppValidActions} from "./context";
import useWindowSize, {DeviceTypes} from "./hooks/useWindowSize";
import axios from "axios";

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
    if(!state.userData.updated) fetchUserData();
    // eslint-disable-next-line
  }, []);

  /** Fetches the user data and marks it as already 'updated' to avoid future unnecessary queries. */
  const fetchUserData = () => {
    // TODO: Fetch the full associated data.
    const url = `${ state.BASE_URL }user/${ state.userData.userId }`;

    axios.get(url)
      .then((response) => {
        const data = {
          updated: true,
          user: response.data.name,
          email: response.data.email,
          imageFile: response.data.imageFile,
          experience: 0, // TODO: Calculate
          typePlanter: '-', // TODO: add to endpoint and ask user to type it.
          plants: response.data.plants,
          followedPlants: response.data.Plantsfollow,
          friends: response.data.follower, // TODO: Check if 'follower' is 'Friends'.
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
          <Route path="collection" element={<Collection />} />
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

