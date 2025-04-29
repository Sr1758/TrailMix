import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css';

const EditProfile = () => {
  const [bio, setBio] = useState('');
  const [privateProfile, setPrivateProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBio(data.bio || '');
          setPrivateProfile(data.private || false);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        bio,
        private: privateProfile,
      });

      alert('✅ Profile updated!');
      navigate('/profile');
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      alert('Error saving profile.');
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>
  
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Enter your bio"
        />
  
        <div className="private-toggle">
          <input
            type="checkbox"
            checked={privateProfile}
            onChange={(e) => setPrivateProfile(e.target.checked)}
          />
          <label>Make my profile private</label>
        </div>
  
        <button onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default EditProfile;