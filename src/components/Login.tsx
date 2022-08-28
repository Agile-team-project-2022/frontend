import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
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
import {DeviceTypes} from "../hooks/useWindowSize";

export interface ILoginProps {
  noClose?: boolean
}

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

const Login: React.FunctionComponent<ILoginProps> = ({noClose}) => {
  const {state: {BASE_URL, deviceType}, dispatch} = useContext(AppContext);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [highlightLoginEmail, setHighlightLoginEmail] = useState(false);
  const [highlightLoginPassword, setHighlightLoginPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    planter: ''
  });
  const [highlightRegisterName, setHighlightRegisterName] = useState(false);
  const [highlightRegisterEmail, setHighlightRegisterEmail] = useState(false);
  const [highlightRegisterPassword, setHighlightRegisterPassword] = useState(false);
  const [highlightRegisterPlanter, setHighlightRegisterPlanter] = useState(false);
  const [successLogin, setSuccessLogin] = useState(false);
  const [successRegister, setSuccessRegister] = useState(false);
  const [failLogin, setFailLogin] = useState(false);
  const [failRegister, setFailRegister] = useState(false);
  const [collapseLogin, setCollapseLogin] = useState(true);
  const [collapseRegister, setCollapseRegister] = useState(true);
  const [disableButton, setDisableButton] = useState(false);

  /** Automatic login after creating an account. */
  useEffect(() => {
    if(successRegister
      && loginData.email !== ''
      && loginData.email.includes('@')
      && loginData.password !== ''
    ) {
      login();
    }
    // eslint-disable-next-line
  }, [loginData]);

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

  const handleChangeRegisterPlanter = (e: ChangeEvent<HTMLInputElement>) => {
    setRegisterData(prevState => {
      return {...prevState, planter: e.target.value}
    });

    setHighlightRegisterPlanter(false);
  };

  /** Indicates 'true' if the login should be disabled. */
  const validateLogin = () => {
    return loginData.email === '' || !loginData.email.includes('@') || loginData.password.length < 5;
  };

  /** Highlights the missing Login values. */
  const showHintsLogin = () => {
    loginData.email === '' || !loginData.email.includes('@')? setHighlightLoginEmail(true) : setHighlightLoginEmail(false);
    loginData.password === '' || loginData.password.length < 5? setHighlightLoginPassword(true) : setHighlightLoginPassword(false);
  };

  /** Indicates 'true' if the login should be disabled. */
  const validateRegister = () => {
    return registerData.email === '' || !registerData.email.includes('@') || registerData.password.length < 5 || registerData.name === '' || registerData.planter === '';
  };

  /** Highlights the missing Login values. */
  const showHintsRegister = () => {
    registerData.email === '' || !registerData.email.includes('@')? setHighlightRegisterEmail(true) : setHighlightRegisterEmail(false);
    registerData.password === '' || registerData.password.length < 5? setHighlightRegisterPassword(true) : setHighlightRegisterPassword(false);
    registerData.name === ''? setHighlightRegisterName(true) : setHighlightRegisterName(false);
    registerData.planter === ''? setHighlightRegisterPlanter(true) : setHighlightRegisterPlanter(false);
  };

  /** Registers new user. */
  const createUser = () => {
    console.log('Authenticating new user....');
    setDisableButton(true);
    const url = `${ BASE_URL }user`;
    const data = {
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      planter_type: registerData.planter,
      imageFile: ''
    };
    axios.post(url, data)
      .then((response) => {
        console.log(response.data);
        console.log('Successfully created user');
        setSuccessRegister(true);
        setDisableButton(false);
        setLoginData(prevState => {
          return { ...prevState, email: registerData.email, password: registerData.password }
        });
      })
      .catch((e) => {
        console.log(e);
        setFailRegister(true);
        setTimeout(() => {
          setFailRegister(false);
        }, 3550);
        setDisableButton(false);
      });
  };

  /** Fetch the login data to check if the user is authorized/registered. */
  const login = () => {
    console.log('Authenticating user to login....');
    setDisableButton(true);
    const url = `${ BASE_URL }user/authenticate`;
    const data = {
      email: loginData.email,
      password: loginData.password
    };
    axios.post(url, data)
      .then((response) => {
        console.log('Successfully logged in user');
        setSuccessLogin(true);
        setDisableButton(false);
        setTimeout(() => {
          dispatch({type: AppValidActions.LOG_IN, payload: {
              userId: response.data.id,
              user: response.data.name,
              token: response.data.token
          }});
          closeLogIn();
        }, 3500);
      })
      .catch((e) => {
        console.log(e);
        setFailLogin(true);
        setTimeout(() => {
          setFailLogin(false);
        }, 3550);
        setDisableButton(false);
      });
  };

  /** Shows the confirmation of successful login or registration. */
  const confirmSuccess = () => {
    return (
      <div className='success-login-container'>
        <div className="success-animation-container">
          <div className="success-animation">
            <div> </div>
            <div> </div>
          </div>
        </div>
      </div>
    );
  };

  /** Shows the if an error occurred during login or registration. */
  const confirmFailure = () => {
    return (
      <div className='success-login-container'>
        <div className="failure-animation-container">
          <div className="failure-animation">
            <div> </div>
            <div> </div>
          </div>
        </div>
      </div>
    );
  };

  /** Cancels the log in attempt and closes the pop up window. */
  const closeLogIn = () => {
    dispatch({type: AppValidActions.CLOSE_LOG_IN});
  };

  /** Expands the login section on mobiles. */
  const expandLogin = () => {
    setCollapseLogin(prevState => !prevState);
  }

  /** Expands the register section on mobiles. */
  const expandRegister = () => {
    setCollapseRegister(prevState => !prevState);
  }

  return (
    <Modal onClose={closeLogIn} className={`login-modal ${noClose? 'no-close-modal' : ''}`} >
      <>
        <div className="login-container">
          <div className={`login-page-container login-section ${collapseLogin? 'collapsed-login' : ''}`}>
            <h2 className='section-title-modal'
                onClick={deviceType === DeviceTypes.MOBILE? expandLogin : () => {}}
            >
              Login
            </h2>
            <label>
              <span>Email</span>
              <input  className={`input-section ${highlightLoginEmail? 'invalid-input' : ''}`}
                      type='text'
                      value={loginData.email}
                      onChange={(e) => handleChangeLoginEmail(e)}
              />
              { highlightLoginEmail? <span className='hint-input'> Invalid email </span> : '' }
            </label>
            <label>
              <span>Password</span>
              <input  className={`input-section ${highlightLoginPassword? 'invalid-input' : ''}`}
                      type='text'
                      value={loginData.password}
                      onChange={(e) => handleChangeLoginPassword(e)}
              />
            </label>
            <button onClick={validateLogin()? showHintsLogin : login} className='button-action' disabled={disableButton} >
              Login
            </button>
            { successLogin? confirmSuccess() : '' }
            { failLogin? confirmFailure() : '' }
          </div>

          <div className={`login-page-container register-section ${collapseRegister? 'collapsed-login' : ''}`}>
            <h2 className='section-title-modal'
                onClick={deviceType === DeviceTypes.MOBILE? expandRegister : () => {}}
            >
              Register
            </h2>
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
              { highlightRegisterEmail? <span className='hint-input'> Invalid email </span> : '' }
            </label>
            <label>
              <span>Password</span>
              <input  className={`input-section ${highlightRegisterPassword? 'invalid-input' : ''}`}
                      type='text'
                      value={registerData.password}
                      onChange={(e) => handleChangeRegisterPassword(e)}
              />
              { highlightRegisterPassword? <span className='hint-input'> Password too short </span> : '' }
            </label>
            <label>
              <span>Planter type</span>
              <input  className={`input-section ${highlightRegisterPlanter? 'invalid-input' : ''}`}
                      type='text'
                      value={registerData.planter}
                      onChange={(e) => handleChangeRegisterPlanter(e)}
              />
            </label>
            <button onClick={validateRegister()? showHintsRegister : createUser} className='button-action' disabled={disableButton} >
              Create account
            </button>
            { successRegister? confirmSuccess() : '' }
            { failRegister? confirmFailure() : '' }
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