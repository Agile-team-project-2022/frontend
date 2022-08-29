import React, {lazy, Suspense, useContext, useState} from 'react';
import './Home.css';
import {AppContext, AppValidActions} from "../context";
import {ListType} from "../components/ExpandedList";
import noContent from "../assets/no-content-yet.png";
import noContentWEBP from "../assets/no-content-yet.webp";
import Loading from "../components/Loading";
import {LazyLoadImage} from "react-lazy-load-image-component";
const NewPost = lazy(() => import('../components/NewPost'));
const PublishedPost = lazy(() => import('../components/PublishedPost'));
const PublishedImage = lazy(() => import('../components/PublishedImage'));
const Filters = lazy(() => import('../components/Filters'));
const ExpandedList = lazy(() => import('../components/ExpandedList'));


export interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const {state: {loggedIn, userData:{user}, homePosts, postsPerPage}, dispatch} = useContext(AppContext);
  const [currentPostsPage, setCurrentPostsPage] = useState(1);
  const [loadingPosts, setLoadingPosts] = useState(false);

  /** Displays the pop up asking for log in. */
  const showLogIn = () => {
    dispatch({type: AppValidActions.SHOW_LOG_IN});
  };

  /** Shows more posts if available. */
  const loadMorePosts = () => {
    setCurrentPostsPage(prevState => prevState + 1);
  };

  /** Stops showing the loading component. */
  const notifyLoading = (loading: boolean) => {
    setLoadingPosts(loading);
  };

  return (
    <main className="home">
      <div className='home-background'> </div>

      <h2 className='welcome-message section-title'>
        Welcome {user.charAt(0).toUpperCase() + user.substring(1)}!
      </h2>

      <Suspense> <Filters onLoading={notifyLoading} /> </Suspense>

      <div className='page-content-container'>
        <section className='publications-container'>
          <Suspense> <NewPost />  </Suspense>
        </section>

        <div className='section-divisor'> </div>

        <section className='publications-container'>
          { loadingPosts? <Loading /> : '' }
          {
            homePosts.length > 0?
              <button className={`button-action load-more-button ${homePosts.length - (currentPostsPage * postsPerPage) <= 0? 'disabled-button' : ''}`}
                      onClick={loadMorePosts}
                      disabled={homePosts.length - (currentPostsPage * postsPerPage) <= 0}
              >
                Load more
              </button>
              :
              ''
          }
          <Suspense>
            {
              homePosts
                .slice(Math.max(homePosts.length - (currentPostsPage * postsPerPage), 0), homePosts.length)
                .map((item, index) => {
                  if(item.title && item.content) return <PublishedPost post={item} key={`published-post-item-${item.id}`} />;
                  else return <PublishedImage post={item} key={`published-post-item-${item.id}`} />
                })
            }
            {
              homePosts.length === 0 && loggedIn?
                <div className='not-found-container'>
                  <LazyLoadImage srcSet={`${noContentWEBP}, ${noContent}`}
                                 alt='No content to show'
                                 effect='black-and-white'
                                 height='100%'
                                 width='100%'
                  />
                </div>
                :
                ''
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