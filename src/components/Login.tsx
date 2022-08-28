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

  /** Registers new user. */
  const createUser = () => {
    console.log('authenticating new user....')
    const url = `${ BASE_URL }user`;
    const data = { // TODO: use correct data
      name: 'user from frontend',
      email: 'bla@bla.com',
      password: '1234',
      planter_type: 'floral',
      imageFile: ''
    };

    axios.post(url, data)
      .then((response) => {
        console.log(response.data);
        console.log('Successfully created user');
      })
      .catch((e) => console.log(e));
  };

  /** Fetch the login data to check if the user is authorized/registered. */
  const login = () => {
    console.log('Authenticating user to login....')
    const url = `${ BASE_URL }user/authenticate`;
    const data = { // TODO: Use correct data
      email: 'bla@bla.com',
      password: '1234'
    };

    axios.post(url, data)
      .then((response) => {
        console.log('Successfully logged in user');
        dispatch({type: AppValidActions.LOG_IN, payload: {
          userId: response.data.id,
          user: response.data.name,
          token: response.data.token
        }});
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
            <button onClick={createUser} className='button-action'> Register </button>
            <button onClick={login} className='button-action'> Login </button>
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