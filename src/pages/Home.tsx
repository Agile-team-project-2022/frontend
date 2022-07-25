import React, {lazy, Suspense} from 'react';
import './Home.css';
const Filters = lazy(() => import('../components/Filters'));

export interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  return (
    <main className="home">
      <div className='home-background'> </div>

      <h2 className='welcome-message section-title'>Welcome "User"!</h2>

      {/* TODO: Create the real filters sections. */}
      <Suspense> <Filters /> </Suspense>

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