import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { GoogleMap } from '@react-google-maps/api';
import '../styles/Explore.css';

const Explore = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '12px',
    marginTop: '2rem'
  };

  const center = {
    lat: 40.7128, // Default: NYC
    lng: -74.0060
  };

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1>
          {user ? 'Ready for another hike? 🥾' : 'Welcome to TrailMixer! 🌲'}
        </h1>
        <p>
          {user
            ? 'Find a new trail to conquer today.'
            : 'Discover and track amazing hiking trails near you.'}
        </p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for trails by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
        >
        </GoogleMap>
    </div>
  );
};

export default Explore;