import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  addDoc
} from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import '../styles/Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [hikes, setHikes] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
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

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Save feedback
      await addDoc(collection(db, 'deletionFeedback'), {
        userId: user.uid,
        email: user.email,
        reason: deleteReason || 'No reason given',
        timestamp: new Date()
      });

      const userRef = doc(db, 'users', user.uid);
      await deleteDoc(userRef);

      const hikesRef = collection(db, 'users', user.uid, 'hikes');
      const hikesSnap = await getDocs(hikesRef);
      const deleteHikePromises = hikesSnap.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteHikePromises);

      // Delete Firebase Auth user
      await deleteUser(user);

      navigate('/');
    } catch (err) {
      console.error('Error deleting account:', err);
      if (err.code === 'auth/requires-recent-login') {
        alert('⚠️ For your security, please log in again before deleting your account.');
        navigate('/login');
      } else {
        alert('Error deleting account. Please try again.');
      }
    }
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

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="delete-account-button"
        >
          Delete Account
        </button>

        {showDeleteConfirm && (
          <div className="delete-confirmation">
            <h3>Are you sure you want to delete your account?</h3>
            <p>This action cannot be undone.</p>
            <textarea
              placeholder="(Optional) Tell us why you're leaving..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            ></textarea>
            <div className="delete-buttons">
              <button onClick={handleDeleteAccount} className="confirm-delete-button">
                Yes, Delete
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="cancel-delete-button">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;