import './App.css';
import Header from './components/Header';
import React, { useState } from 'react';
import TollGateForm from './components/TollGateForm';
import PointsManagement from './components/PointsManagement';
import TransactionList from './components/TransactionList';
import Login from './components/Login'

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const userType = localStorage.getItem('type');

  const [page, setPage]= useState('transaction_list');

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('type');
    setLoggedIn(false);
  };


  return (
    <>
      {isLoggedIn ? (
        <>
          <Header isLoggedIn={true} onLogout={handleLogout} userType={userType} setPage={setPage}/>

          {
            page=="transaction_list"?
            <TransactionList /> :
            page=="parking_points_management"?
            <PointsManagement /> :
            page=="toll_gate_form" && userType=="Toll"?
            <TollGateForm /> :
            <></>
          }
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
};

export default App;
