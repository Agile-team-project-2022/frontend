import React, {lazy, Suspense, useContext, useEffect} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./layouts/Header";
import {AppContext, AppValidActions} from "./context";
import useWindowSize, {DeviceTypes} from "./hooks/useWindowSize";

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

