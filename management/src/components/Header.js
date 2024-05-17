// src/components/Header.js
import React from 'react';
import './Header.css'; // Import the custom CSS file


const Header = ({ isLoggedIn, onLogout, userType, setPage }) => {
  return (
    <>
    <header className="header-container">
      <h1 className="header-title">GatePay</h1>
      {isLoggedIn && (
        <>
          <button className="header-button" onClick={() => setPage('transaction_list')}>TRANSACTION LIST</button>
          <button className="header-button" onClick={() => setPage('parking_points_management')}>PARKING LOT POINTS MANAGEMENT</button>
          {userType=="Toll"?
          <button className="header-button" onClick={() => setPage('toll_gate_form')}>TOLL GATE FORM</button>
          :
          <></>
          }
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </>
      )}
    </header>
    </>
  );
};

export default Header;