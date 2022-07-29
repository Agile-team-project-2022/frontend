import React, {lazy, Suspense, useContext} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./layouts/Header";
import {AppContext} from "./context";
const Home = lazy(() => import('./pages/Home'));
const Collection = lazy(() => import('./pages/Collection'));
const Login = lazy(() => import('./components/Login'));

export interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (props) => {
  const {state} = useContext(AppContext);

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
    </BrowserRouter>
  );
}

export default App;

