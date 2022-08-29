import React, {lazy, Suspense, useContext, useState} from 'react';
import logo from '../assets/logo.svg';
import appName from '../assets/app-name.svg';
import settingsImg from '../assets/settings.png';
import settingsImgWEBP from '../assets/settings.webp';
import helpImg from '../assets/help.png';
import helpImgWEBP from '../assets/help.webp';
import animatedHeader from '../assets/header-1.json';
import {Link, useNavigate} from "react-router-dom";
import {Player} from "@lottiefiles/react-lottie-player";
import './Header.css';
import {AppContext, AppValidActions} from "../context";
import {ListType} from "../components/ExpandedList";
import Modal from "../components/Modal";
import Settings from "../components/Settings";
const ExpandedList = lazy(() => import('../components/ExpandedList'));

export interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  const {state, dispatch} = useContext(AppContext);
  const [expanded, setExpanded] = useState(false);
  const [expandedFollowType, setExpandedFollowType] = useState(ListType.FOLLOWED_PLANTS);
  const [expandedFollowSection, setExpandedFollowSection] = useState(false);
  const [expandedSettingsSection, setExpandedSettingsSection] = useState(false);
  const navigate = useNavigate();

  /** Shows the menu options on mobiles. */
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
    console.log('Successfully logged out');
    expandMobileMenu();
  };

  /** Expands the followed plants section on mobile devices. */
  const expandFollowedPlants = () => {
    setExpandedFollowType(ListType.FOLLOWED_PLANTS);
    setExpandedFollowSection(true);
    expandMobileMenu();
  }

  /** Expands the friends section on mobile devices. */
  const expandFriends = () => {
    setExpandedFollowType(ListType.FRIENDS);
    setExpandedFollowSection(true);
    expandMobileMenu();
  }

  /** Shows the settings options for any device. */
  const expandSettings = () => {
    setExpandedSettingsSection(true);
  }

  /** Handles closing the follow section on mobile devices. */
  const onCloseFollow = () => {
    setExpandedFollowSection(false);
  }

  /** Handles closing the settings section on any devices. */
  const onCloseSettings = () => {
    setExpandedSettingsSection(false);
  }

  /** Navigates back to home page if clicked on the logo. */
  const goHomePage = () => {
    navigate(`/home`, {replace: false});
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
        <div className='logo-container' onClick={goHomePage} >
          <img src={logo} className="logo" alt="InterPlant logo" />
        </div>

        <div className='app-name-container'>
          <img src={appName} className="app-name" alt="InterPlant" />
        </div>

        <div className={`header-nav-container ${expanded? 'expanded-mobile-menu' : ''}`}>
          <nav className='header-nav'>
            <Link to={'home'} className='header-nav-link' onClick={expandMobileMenu} >
              <span>Home</span>
            </Link>

            <Link to={'collection'}
                  className={`header-nav-link ${state.loggedIn? '' : 'disable-collection'}`}
                  onClick={expandMobileMenu}
            >
              <span>Collection</span>
            </Link>

            <button className={`header-nav-link mobile-menu-option ${state.loggedIn? '' : 'disable-collection'}`}
                    onClick={expandFollowedPlants}
            >
              Following plants
            </button>

            <button className={`header-nav-link mobile-menu-option ${state.loggedIn? '' : 'disable-collection'}`}
                    onClick={expandFriends}
            >
              Friends
            </button>

            <Link to={'home'}
                  className='header-nav-link'
                  onClick={state.loggedIn? logOut : showLogIn}
            >
              <span> {state.loggedIn? 'Log out' : 'Log in'} </span>
            </Link>
          </nav>
        </div>

        <button className='header-option-container settings-logo' onClick={expandSettings}>
          <picture>
            <source srcSet={settingsImgWEBP} type="image/webp"/>
            <img src={settingsImg} alt="settings button" />
          </picture>
        </button>
        <button className='header-option-container help-logo'>
          <picture>
            <source srcSet={helpImgWEBP} type="image/webp"/>
            <img src={helpImg} alt="help button" />
          </picture>
        </button>

        <button className={`burger-icon ${expanded? 'selected-burger-icon' : ''}`}
                onClick={expandMobileMenu}
                aria-label='Expand menu'
        >
          <div> </div>
          <div> </div>
          <div> </div>
        </button>
      </div>

      {
        expandedFollowSection?
          <Suspense>
            <ExpandedList title={expandedFollowType === ListType.FOLLOWED_PLANTS? 'Plants you Follow' : 'Your friends' }
                          type={expandedFollowType}
                          show={true}
                          onClose={onCloseFollow}
            />
          </Suspense>
          :
          ''
      }

      {
        expandedSettingsSection?
          <Modal onClose={onCloseSettings} className='settings-container-modal'>
            <Settings />
          </Modal>
          :
          ''
      }
    </header>
  );
}

export default Header;