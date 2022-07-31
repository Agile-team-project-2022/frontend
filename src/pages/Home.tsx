import React, {lazy, Suspense, useContext} from 'react';
import './Home.css';
import {AppContext} from "../context";
import {ListType} from "../components/ExpandedList";
const Filters = lazy(() => import('../components/Filters'));
const ExpandedList = lazy(() => import('../components/ExpandedList'));

export interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const {state} = useContext(AppContext);

  return (
    <main className="home">
      <div className='home-background'> </div>

      <h2 className='welcome-message section-title'>
        Welcome {state.user.charAt(0).toUpperCase() + state.user.substring(1)}!
      </h2>

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
        <Suspense>
          <ExpandedList title='Plants you Follow' type={ListType.FOLLOWED_PLANTS} />
          <ExpandedList title='Your friends' type={ListType.FRIENDS} />
        </Suspense>
      </div>

      <p className='copyright-footer'>InterPlant system 2022</p>
    </main>
  );
}

export default Home;