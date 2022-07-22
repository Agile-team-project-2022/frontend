import React from 'react';
import logo from './assets/logo.svg';
import appName from './assets/app-name.svg';
import settingsImg from './assets/settings.png';
import helpImg from './assets/help.png';
import { Link } from "react-router-dom";
import './Header.css';

export interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  return (
    <header className="app-header">
      <div className="app-header-background">
      </div>

      <div className="app-header-content">
        <div className='logo-container'>
          <img src={logo} className="logo" alt="InterPlant logo" />
        </div>
        <div className='app-name-container'>
          <img src={appName} className="app-name" alt="InterPlant" />
        </div>

        <nav className='header-nav'>
          <Link to={'/home'} className='header-nav-link'>
            <span>Home</span>
          </Link>

          <Link to={'/collection'} className='header-nav-link'>
            <span>Collection</span>
          </Link>

          <Link to={'/log-out'} className='header-nav-link'>
            <span>Log out</span>
          </Link>
        </nav>

        <button className='header-option-container settings-logo'>
          <img src={settingsImg} alt="settings button" />
        </button>
        <button className='header-option-container help-logo'>
          <img src={helpImg} alt="help button" />
        </button>

      </div>
    </header>
  );
}

export default Header;