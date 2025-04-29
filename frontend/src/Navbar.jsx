import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">TrailMixer</div>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/editprofile">Edit Profile</Link></li>
        {/* Add more links */}
      </ul>
    </nav>
  );
};

export default Navbar;