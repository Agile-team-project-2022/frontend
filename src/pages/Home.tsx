import React from 'react';
import './Home.css';

export interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  return (
    <main className="home">
      <div className='home-background'> </div>

      <h2 className='welcome-message section-title'>Welcome "User"!</h2>

      {/* TODO: Create the real filters sections. */}
      <div className='filters-section-container'>
        <div className='filter-div-container'>
          <h3 className='button-open-section'>Filter by category</h3>
        </div>
        <div className='filter-div-container'>
          <h3 className='button-open-section'>Currently filtering by</h3>
        </div>
      </div>

      <div className='page-content-container'>
        <section className='publications-container'>
          <h2 className='section-title'>Write new post</h2>
          {/* TODO: Posts component goes here - Status: Write new Post. */}
        </section>

        <section className='publications-container'>
          <h2 className='section-title'>Publications</h2>
          {/* TODO: Posts component goes here - Status: Published Post. */}
        </section>
      </div>

      <div className='home-buttons-container'>
        <button className='button-open-section'>Plants you Follow: 20</button>
        <button className='button-open-section'>Your Friends: 15</button>
      </div>

      <p className='copyright-footer'>InterPlant system 2022</p>
    </main>
  );
}

export default Home;