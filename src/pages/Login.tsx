import React from 'react';
import './Login.css';

export interface ILoginProps {}

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  return (
    <main className="login">
      <h2>Login Page</h2>
    </main>
  );
}

export default Login;