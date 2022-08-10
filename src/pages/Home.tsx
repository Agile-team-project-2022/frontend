import React, {lazy, Suspense, useContext} from 'react';
import './Home.css';
import {AppContext, AppValidActions} from "../context";
import {ListType} from "../components/ExpandedList";

import NewPost from '../components/NewPost';
import PublishedPost from "../components/PublishedPost";

const Filters = lazy(() => import('../components/Filters'));
const ExpandedList = lazy(() => import('../components/ExpandedList'));


export interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const {state: {loggedIn, userData:{user, posts}}, dispatch} = useContext(AppContext);

  /** Displays the pop up asking for log in. */
  const showLogIn = () => {
    dispatch({type: AppValidActions.SHOW_LOG_IN});
  };

  return (
    <main className="home">
      <div className='home-background'> </div>

      <h2 className='welcome-message section-title'>
        Welcome {user.charAt(0).toUpperCase() + user.substring(1)}!
      </h2>

      {/* TODO: Create the real filters sections. */}
      <Suspense> <Filters /> </Suspense>

      <div className='page-content-container'>
        <section className='publications-container'>
          {/* TODO: Posts component goes here - Status: Write new NewPost. */}
          <NewPost />
        </section>

        <div className='section-divisor'> </div>

        <section className='publications-container'>
          <h2 className='section-title'>Publications</h2>
          {/* TODO: Posts component goes here - Status: Published NewPost. */}
          {
            posts.map((item, index) => {
              return <PublishedPost post={item} key={`published-post-item-${item.id}`} />
            })
          }
        </section>
      </div>

      <div className='home-buttons-container'>
        {
          loggedIn?
            <Suspense>
              <ExpandedList title='Plants you Follow' type={ListType.FOLLOWED_PLANTS} />
              <ExpandedList title='Your friends' type={ListType.FRIENDS} />
            </Suspense>
            :
            <button className='button-open-section login-home-button'
                    onClick={showLogIn}
            >
              Log In
            </button>
        }
      </div>

      <p className='copyright-footer'>InterPlant system 2022</p>
    </main>
  );
}

export default Home;