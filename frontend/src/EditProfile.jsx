import React, { useState, useEffect } from 'react';
import './styles/EditProfile.css';

const EditProfile = () => {
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('privacySetting', isPrivate);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/1', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Profile updated successfully!');
        console.log('Updated user:', data.user);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setMessage('❌ Error updating profile.');
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form className="edit-profile-form" onSubmit={handleSave}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Profile Picture:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files[0])}
        />

        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          {' '}Private Profile
        </label>

        <button type="submit">
          Save Changes
        </button>
      </form>

      {message && <p className="edit-profile-message">{message}</p>}
    </div>
  );
};

export default EditProfile;