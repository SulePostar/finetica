import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '../pages/Register/Register';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<div>Home Page</div>} />
    </Routes>
  );
};

export default AppRoutes;