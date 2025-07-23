import React from 'react';
import { Link } from 'react-router-dom';
import AppRoutes from './routes/routes';
import { Button, Alert } from 'react-bootstrap';
import './App.css';

function App() {
  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
