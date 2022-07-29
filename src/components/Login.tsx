import React, {ChangeEvent, useContext, useState} from 'react';
import './Login.css';
import {CredentialResponse, GoogleLogin} from '@react-oauth/google';
import Modal from "./Modal";
import {AppContext, AppValidActions} from "../context";

export interface ILoginProps {}

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  const {dispatch} = useContext(AppContext)
  const [userName, setUserName] = useState('');

  /** Handles the text input field for the userName. Formats the input and Removes invalid characters. */
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value.replace(/[^a-zA-Z 0-9]/gi, ''));
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
    <Modal onClose={closeLogIn}>
      <div className="login-container">
        <h2>Please Log In</h2>

        <label htmlFor='name'>Name to display</label>
        <input type='text'
               name='name'
               // Note: The 1st name limit length 35 is based on the UK Government Data Standards Catalogue.
               maxLength={35}
               value={userName}
               onChange={(e) => handleOnChange(e)}
        />

        <div className={`login-button ${userName.length === 0? 'disabled-login' : ''}`} >
          <GoogleLogin
            onSuccess={loginSuccess}
            onError={loginFailure}
          />
          {/** TODO: Check if name to display should be put here. */}
          <p>Please type a name to continue.</p>
        </div>
      </div>
    </Modal>

  );
}

export default Login;