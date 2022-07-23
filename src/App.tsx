import React, {lazy, Suspense} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./layouts/Header";
const Home = lazy(() => import('./pages/Home'));
const Collection = lazy(() => import('./pages/Collection'));
const Login = lazy(() => import('./pages/Login'));

export interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (props) => {
  return (
    <BrowserRouter>
      <Header />

      {/* TODO: Design a Loading component to render in the meanwhile. */}
      <Suspense fallback={<span>Loading...</span>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="collection" element={<Collection />} />
          <Route path="log-in" element={<Login />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

