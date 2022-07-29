import React, {useContext, useState} from 'react';
import logo from '../assets/logo.svg';
import appName from '../assets/app-name.svg';
import settingsImg from '../assets/settings.png';
import helpImg from '../assets/help.png';
import animatedHeader from '../assets/header-1.json';
import { Link } from "react-router-dom";
import {Player} from "@lottiefiles/react-lottie-player";
import './Header.css';
import {AppContext, AppValidActions} from "../context";
import { googleLogout } from '@react-oauth/google';

export interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  const {state, dispatch} = useContext(AppContext);
  const [expanded, setExpanded] = useState(false);

  const expandMobileMenu = () => {
    setExpanded(prevState => !prevState);
  };

  /** Displays the pop up asking for log in. */
  const showLogIn = () => {
    dispatch({type: AppValidActions.SHOW_LOG_IN});
    expandMobileMenu();
  };

  /** Handles log out action. */
  const logOut = () => {
    dispatch({type: AppValidActions.LOG_OUT});
    googleLogout();
    expandMobileMenu();
  };

  return (
    <header className="app-header">
      <div className="app-header-background">
        <Player id="header-lottie"
                autoplay
                loop
                src={animatedHeader}
        />
      </div>

      <div className="app-header-content">
        <div className='logo-container'>
          <img src={logo} className="logo" alt="InterPlant logo" />
        </div>

        <div className='app-name-container'>
          <img src={appName} className="app-name" alt="InterPlant" />
        </div>

        <div className={`header-nav-container ${expanded? 'expanded-mobile-menu' : ''}`}>
          <nav className='header-nav'>
            <Link to={'home'} className='header-nav-link' onClick={() => expandMobileMenu()} >
              <span>Home</span>
            </Link>

            <Link to={'collection'} className='header-nav-link' onClick={() => expandMobileMenu()} >
              <span>Collection</span>
            </Link>

            {/* TODO: Create the event listeners for Following plants/Friends. */}
            <button className='header-nav-link mobile-menu-option' onClick={() => expandMobileMenu()} >
              Following plants
            </button>

            <button className='header-nav-link mobile-menu-option' onClick={() => expandMobileMenu()} >
              Friends
            </button>

            <Link to={'home'}
                  className='header-nav-link'
                  onClick={state.loggedIn? () => logOut() : () => showLogIn()}
            >
              <span> {state.loggedIn? 'Log out' : 'Log in'} </span>
            </Link>
          </nav>
        </div>

        <button className='header-option-container settings-logo'>
          <img src={settingsImg} alt="settings button" />
        </button>
        <button className='header-option-container help-logo'>
          <img src={helpImg} alt="help button" />
        </button>

        <button className={`burger-icon ${expanded? 'selected-burger-icon' : ''}`}
                onClick={() => expandMobileMenu()}
        >
          <div> </div>
          <div> </div>
          <div> </div>
        </button>
      </div>
    </header>
  );
}

export default Header;