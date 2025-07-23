import React from 'react';
import { Link } from 'react-router-dom';
import AppRoutes from './routes/routes';
import { Button, Alert } from 'react-bootstrap';
import './App.css';
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Finetica
          </Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/">
              Home
            </Link>
            <Link className="nav-link" to="/register">
              Register
            </Link>
          </div>
        </div>
      </nav>

      <AppRoutes />

      <div className="container mt-5">
        <Alert variant="info">
          <strong>Testing Navigation:</strong>
          <ul className="mb-0 mt-2">
            <li>
              <Link to="/">Go to Home</Link>
            </li>
            <li>
              <Link to="/register">Go to Register</Link>
            </li>
          </ul>
        </Alert>
      </div>
    </div>
  );
}

export default App;
