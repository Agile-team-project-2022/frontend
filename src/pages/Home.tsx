import React from 'react';
import './Home.css';

export interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  return (
    <main className="home">
      <h2>Home Page</h2>
    </main>
  );
}

export default Home;