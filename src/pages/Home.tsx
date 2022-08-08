import React, {lazy, Suspense, useContext} from 'react';
import './Home.css';
import "../components/Publications.css";

// temporary imports of assets

import likeIcon from '../assets/like-empty.png';
import commentIcon from '../assets/comment.png';
import reportIcon from "../assets/report.png";

import dummyImage from "../assets/login-img-4.jpg";

import {AppContext, AppValidActions} from "../context";
import {ListType} from "../components/ExpandedList";
import Post from '../components/Posts';
const Filters = lazy(() => import('../components/Filters'));
const ExpandedList = lazy(() => import('../components/ExpandedList'));

export interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const {state: {loggedIn, userData:{user}}, dispatch} = useContext(AppContext);

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
          {/* <h2 className='section-title'>Write new post</h2> */}
          {/* TODO: Posts component goes here - Status: Write new Post. */}
          <Post />
        </section>

        <section className='publications-container'>
          <h2 className='section-title'>Publications</h2>
          {/* TODO: Posts component goes here - Status: Published Post. */}



          <div className='Publication-container'>
            {/* the content of the post */}
            <div className='pub-content'>
                <span className='pub-date'>12 july 2021</span>
                <div className='pub-img'>
                    <img aria-hidden alt='post' src={dummyImage}/>
                </div>
                <h2 className='pub-title'>Post Title</h2>
                <p className='pub-body'>Plant
                  Post content about the Plant Post content about the Plant Post content about the Plant
                  PlantPost content about the Plant Post content about the Plant Post content about the Plant
                  Plant Post content about the Plant Post  Post content about the Plant Post content about the Plant
                  Plant Post content about the Plant Post Post content about the Plant Post content about the Plant
                  the Plant Post content about the Plant Plant. Post content about the Plant
                  </p>
            </div>

            {/* controls and author info */}
            <div className='pub-info-controls'>
              <div className='pub-info'>
                <span>By Ahmed </span>
                <img aria-hidden src={dummyImage} alt="profile"/>
              </div>
              <div className='pub-controls'>

                <button className='pub-report-button'>
                  <img aria-hidden alt="report" src={reportIcon}/>
                </button>

                <button className='pub-like-button'>
                  <img aaria-hidden alt="like" src={likeIcon}/>
                  <span>like (510)</span>
                </button>

                <button className='pub-comment-button'>
                  <img aria-hidden alt="comment" src={commentIcon}/>
                  <span>Comments (21)</span>
                </button>

              </div>
            </div>

            
          </div>
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