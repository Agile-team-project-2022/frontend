import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import './Login.css';
import GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline} from "react-google-login";
import Modal from "./Modal";
import {AppContext, AppValidActions} from "../context";

export interface ILoginProps {}

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  const {dispatch} = useContext(AppContext)
  const [userName, setUserName] = useState('');
  // TODO: Update with correct CLIENT ID.
  const clientId: string = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    console.log('-Client -> ', clientId)
  }, []);

  /** Handles the text input field for the userName. Formats the input and Removes invalid characters. */
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value.replace(/[^a-zA-Z 0-9]/gi, ''));
  };

  /** Triggered when Google Login confirms the account. */
  const loginSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    console.log('Successful login');
  };

  /** Handles problems to log in with Google account. */
  const loginFailure = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    console.log('Problem with login');
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

        <GoogleLogin
          disabled={userName.length === 0}
          clientId={clientId}
          buttonText="Log in with Google"
          onSuccess={loginSuccess}
          onFailure={loginFailure}
          cookiePolicy={"single_host_origin"}
        />
      </div>
    </Modal>

  );
}

export default Login;