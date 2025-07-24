import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppRoutes from './routes/routes';
import { Button, Alert } from 'react-bootstrap';
import './App.css';

function App() {
  const location = useLocation();

  // Hide navbar on login and register pages
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App">
      {!hideNavbar && (
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
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </div>
          </div>
        </nav>
      )}
      <AppRoutes />
    </div>
  );
}

export default App;
