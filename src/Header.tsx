import React from 'react';
import logo from './assets/logo.svg';
import appName from './assets/app-name.svg';
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

          <Link to={'/services'} className='header-nav-link'>
            <span>Services</span>
          </Link>

          <Link to={'/contact-us'} className='header-nav-link'>
            <span>Contact us</span>
          </Link>
        </nav>

      </div>
    </header>
  );
}

export default Header;