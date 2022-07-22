import React from 'react';
import './App.css';
import Home from "./Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";

export interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

