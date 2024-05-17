// src/components/Login.js
import React, { useState } from 'react';
import Header1 from './Header1';
import './Login.css'; // Import the custom CSS file

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log(username, password);
    try {
      const response = await fetch('https://gatepay-server.vercel.app/api/employee/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: username,
          Password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      const token = data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('type', data.userType);

      onLogin();
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <>    
    <Header1/>
    <br/>
    <div className="login-container">
      <h2 className="login-heading">LogIn</h2>
      <hr/>
      <form className="login-form">
        <label htmlFor="email" className="login-label">
          Email:
          <input
            type="email"
            className="login-input"
            id="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label htmlFor="password" className="login-label">
          Password:
          <input
            type="password"
            className="login-input"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="button" className="login-button" onClick={handleLogin}>
          LOGIN
        </button>
      </form>
    </div>
    </>
  );
};

export default Login;
