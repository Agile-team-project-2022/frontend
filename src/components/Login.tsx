import React, {ChangeEvent, useContext, useState} from 'react';
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
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [highlightLoginEmail, setHighlightLoginEmail] = useState(false);
  const [highlightLoginPassword, setHighlightLoginPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [highlightRegisterName, setHighlightRegisterName] = useState(false);
  const [highlightRegisterEmail, setHighlightRegisterEmail] = useState(false);
  const [highlightRegisterPassword, setHighlightRegisterPassword] = useState(false);

  /** Updates the typed values. */
  const handleChangeLoginEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginData(prevState => {
      return {...prevState, email: e.target.value}
    });

    setHighlightLoginEmail(false);
  };

  const handleChangeLoginPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginData(prevState => {
      return {...prevState, password: e.target.value}
    });

    setHighlightLoginPassword(false);
  };

  const handleChangeRegisterName = (e: ChangeEvent<HTMLInputElement>) => {
    setRegisterData(prevState => {
      return {...prevState, name: e.target.value}
    });

    setHighlightRegisterName(false);
  };

  const handleChangeRegisterEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setRegisterData(prevState => {
      return {...prevState, email: e.target.value}
    });

    setHighlightRegisterEmail(false);
  };

  const handleChangeRegisterPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setRegisterData(prevState => {
      return {...prevState, password: e.target.value}
    });

    setHighlightRegisterPassword(false);
  };

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
          <div className='login-page-container login-section'>
            <h2 className='section-title-modal'>Login</h2>
            <label>
              <span>Email</span>
              <input  className={`input-section ${highlightLoginEmail? 'invalid-input' : ''}`}
                      type='text'
                      value={loginData.email}
                      onChange={(e) => handleChangeLoginEmail(e)}
              />
            </label>
            <label>
              <span>Password</span>
              <input  className={`input-section ${highlightLoginPassword? 'invalid-input' : ''}`}
                      type='text'
                      value={loginData.password}
                      onChange={(e) => handleChangeLoginPassword(e)}
              />
            </label>
            <button onClick={login} className='button-action'> Login </button>
          </div>

          <div className='login-page-container register-section'>
            <h2 className='section-title-modal'>Register</h2>
            <label>
              <span>Name</span>
              <input  className={`input-section ${highlightRegisterName? 'invalid-input' : ''}`}
                      type='text'
                      value={registerData.name}
                      onChange={(e) => handleChangeRegisterName(e)}
              />
            </label>
            <label>
              <span>Email</span>
              <input  className={`input-section ${highlightRegisterEmail? 'invalid-input' : ''}`}
                      type='text'
                      value={registerData.email}
                      onChange={(e) => handleChangeRegisterEmail(e)}
              />
            </label>
            <label>
              <span>Password</span>
              <input  className={`input-section ${highlightRegisterPassword? 'invalid-input' : ''}`}
                      type='text'
                      value={registerData.password}
                      onChange={(e) => handleChangeRegisterPassword(e)}
              />
            </label>
            <button onClick={createUser} className='button-action'> Create account </button>
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