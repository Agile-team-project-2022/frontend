import React, { useContext } from 'react';
import './Login.css';
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
  const {state: {BASE_URL}, dispatch} = useContext(AppContext);

  /** Fetch the login data to check if the user is authorized/registered. */
  const authUser = () => {
    console.log('authenticating....')
    const url = `${ BASE_URL }auth/login/success`;
    const headers = {
      "Access-Control-Allow-Credentials": 'true',
      "Access-Control-Allow-Origin": 'true',
      "SameSite": 'Secure'
    };

    axios.defaults.withCredentials = true;
    axios.get(url, {headers: headers})
      .then((response) => {
        console.log(response.data);
        console.log('success')
      })
      .catch((e) => console.log(e));
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

          <div>
            <button onClick={authUser} className='button-action'> Test Auth LogIn </button>
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