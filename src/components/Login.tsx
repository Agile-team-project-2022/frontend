import React, {ChangeEvent, useContext, useState} from 'react';
import './Login.css';
import {CredentialResponse, GoogleLogin} from '@react-oauth/google';
import Modal from "./Modal";
import {AppContext, AppValidActions} from "../context";
import axios from "axios";
import loginImg1 from '../assets/login-img-1.jpg';
import loginImg2 from '../assets/login-img-2.jpg';
import loginImg3 from '../assets/login-img-3.jpg';
import loginImg4 from '../assets/login-img-4.jpg';
import loginImg5 from '../assets/login-img-5.jpg';
import loginImg6 from '../assets/login-img-6.jpg';
import loginImg7 from '../assets/login-img-7.jpg';
import loginImg8 from '../assets/login-img-8.jpg';
import loginImg9 from '../assets/login-img-9.jpg';
import loginImg10 from '../assets/login-img-10.jpg';

export interface ILoginProps {}

const decorativeImages = [
  loginImg1,
  loginImg2,
  loginImg3,
  loginImg4,
  loginImg5,
  loginImg6,
  loginImg7,
  loginImg8,
  loginImg9,
  loginImg10
];

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  const {dispatch} = useContext(AppContext)
  const [userName, setUserName] = useState('');

  /** Handles the text input field for the userName. Formats the input and Removes invalid characters. */
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value.replace(/[^a-zA-Z 0-9]/gi, ''));
  };

  /** Fetch the login data to check if the user is authorized/registered. */
  const authUser = () => {
    console.log('authenticating....')
    const url = `${ process.env.REACT_APP_BASE_URL || '' }auth/login/success`;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    };

    axios.defaults.withCredentials = true;
    axios.get(url, {headers: headers})
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => console.log(e));
  };

  /** Triggered when Google Login confirms the account. */
  const loginSuccess = (response: CredentialResponse) => {
    // TODO: Build a confirmation pop up.
    alert('Successful login');
    dispatch({type: AppValidActions.LOG_IN, payload: {user: userName}});
    closeLogIn();
  };

  /** Handles problems to log in with Google account. */
  const loginFailure = () => {
    // TODO: Build a confirmation pop up.
    alert('Problem with login');
  };

  /** Cancels the log in attempt and closes the pop up window. */
  const closeLogIn = () => {
    dispatch({type: AppValidActions.CLOSE_LOG_IN});
  };

  return (
    <Modal onClose={closeLogIn} className='login-modal' >
      <>
        <div className="login-container">
          <h2 className='section-title-modal'>Please Log In</h2>

          <label htmlFor='name'>Name to display</label>
          <input type='text'
                 name='name'
                 autoFocus={true}
                 autoComplete={'off'}
            // Note: The 1st name limit length 35 is based on the UK Government Data Standards Catalogue.
                 maxLength={35}
                 value={userName}
                 onChange={(e) => handleOnChange(e)}
          />

          <div>
            <button onClick={authUser}> Test Auth </button>
          </div>

          <div className={`login-button ${userName.length === 0? 'disabled-login' : ''}`} >
            <GoogleLogin
              onSuccess={loginSuccess}
              onError={loginFailure}
            />
            {/** TODO: Check if name to display should be put here. */}
            <p>Please type a name to continue.</p>
          </div>
        </div>

        <div className='login-img-container'>
          {
            decorativeImages.map((image, index) => {
              return (
                <img src={image} key={`decorative-img-${index}`} alt='Decorative plant.'/>
              );
            })
          }
        </div>
      </>
    </Modal>

  );
}

export default Login;