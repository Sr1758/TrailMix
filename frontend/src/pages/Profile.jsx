import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import '../styles/Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [hikes, setHikes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const hikesRef = collection(db, 'users', user.uid, 'hikes');
        const hikesSnap = await getDocs(hikesRef);
        const hikesData = hikesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (userSnap.exists()) {
          setUserData(userSnap.data());
          setHikes(hikesData);
        } else {
          console.log('No user data found');
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
        <p className="profile-trails">Trails Completed: {hikes.length}</p>

        <button onClick={handleEditProfile} className="edit-profile-button">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;