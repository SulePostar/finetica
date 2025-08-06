import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '../pages/Register/Register';
import LoginPage from '../pages/LoginPage/LoginPage';
import ProfilePage from '../pages/Profile/ProfilePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/" element={<div>Home Page</div>} />

    </Routes>
  );
};
export default AppRoutes;