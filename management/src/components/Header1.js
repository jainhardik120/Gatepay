// src/components/Header.js
import React from 'react';
import './Header.css'; 


const Header1 = ({ isLoggedIn, onLogout, userType, setPage }) => {
  return (
    <>
    <header className="header-container">
      <h1 className="header-title">GatePay</h1>
    </header>
    </>
  );
};

export default Header1;