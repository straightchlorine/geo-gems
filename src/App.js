import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">
            <img src="geogem32x32.jpg" id='icon' width="32" height="32" className="mr-2 align-top" />
            GeoGems
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Strona główna
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/map">
                  Mapa
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
