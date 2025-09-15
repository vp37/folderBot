// src/layout/Layout.js
import React from 'react';
import Navbar from '../components/navbar/Navbar';
import { Outlet } from 'react-router-dom';
import '../layout/Layout.css'

const Layout = () => {
  return (
    <div className="layoutContainer">
      <Navbar />
      <div className="mainContent">
        <Outlet />
      </div>
    </div>
    
  );
};

export default Layout;