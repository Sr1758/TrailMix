import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  return (
    <div className="profile-background">
      <div className="profile-card">
        <div className="profile-picture-placeholder">
          {/* Later can add profile picture here */}
          <span>👤</span>
        </div>
        <h2 className="profile-username">Username: testuser</h2>

        <button onClick={handleEditProfile} className="edit-profile-button">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;