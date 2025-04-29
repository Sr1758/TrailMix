import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.log('No user data found!');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  if (!userData) {
    return <div className="profile-background">Loading profile...</div>;
  }

  return (
    <div className="profile-background">
      <div className="profile-card">
        <div className="profile-picture-placeholder">
          <span>👤</span>
        </div>
        <h2 className="profile-username">Email: {userData.email}</h2>
        <p className="profile-bio">Bio: {userData.bio || 'No bio yet.'}</p>
        <p className="profile-trails">Trails Completed: {userData.trailsCompleted}</p>

        <button onClick={handleEditProfile} className="edit-profile-button">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;