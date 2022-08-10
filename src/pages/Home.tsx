import React, {lazy, Suspense, useContext, useEffect} from 'react';
import './Home.css';
import {AppContext, AppValidActions} from "../context";
import {ListType} from "../components/ExpandedList";
import axios from "axios";
const NewPost = lazy(() => import('../components/NewPost'));
const PublishedPost = lazy(() => import('../components/PublishedPost'));
const Filters = lazy(() => import('../components/Filters'));
const ExpandedList = lazy(() => import('../components/ExpandedList'));


export interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const {state: {loggedIn, userData:{user}, homePosts, BASE_URL}, dispatch} = useContext(AppContext);

  /** Gets all the Posts data only for the first time. */
  useEffect(() => {
    const fetchAllPosts = () => {
      const url = `${ BASE_URL }post?page=1&count=10`;
      axios.get(url)
        .then((response) => {
          dispatch({type: AppValidActions.UPDATE_HOME_POSTS, payload: {homePosts: response.data}});
        })
        .catch((e) => console.log(e));
    };

    fetchAllPosts();
    // eslint-disable-next-line
  }, []);

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
          <Suspense> <NewPost />  </Suspense>
        </section>

        <div className='section-divisor'> </div>

        <section className='publications-container'>
          <Suspense>
            {
              homePosts.map((item, index) => {
                return <PublishedPost post={item} key={`published-post-item-${item.id}`} />
              })
            }
          </Suspense>
          <h2 className='section-title publications-section-title'>Publications</h2>
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