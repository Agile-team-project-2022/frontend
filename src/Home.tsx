import React from 'react';
import './Home.css';
import Header from "./Header";

export interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  return (
    <div className="App">
      <Header />
    </div>
  );
}

export default Home;