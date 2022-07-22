import React from 'react';
import './App.css';
import Home from "./Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./Header";

export interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (props) => {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="home" element={<Home />} />

        {/* TODO: Update the following routes with the correct components */}
        <Route path="collection" element={<Home />} />
        <Route path="log-out" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

