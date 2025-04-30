import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css';

// Example trails array (replace with your actual njTrails array or import it)
const trails = [
  { id: 1, name: "Delaware Water Gap" },
  { id: 2, name: "Buttermilk Falls" },
  { id: 3, name: "Mount Tammany" },
  { id: 4, name: "Stairway to Heaven" },
  { id: 5, name: "Pyramid Mountain" },
  { id: 6, name: "Ramapo Valley County Reservation" },
  { id: 7, name: "Watchung Reservation" },
  { id: 8, name: "High Point State Park" },
  { id: 9, name: "South Mountain Reservation" },
  { id: 10, name: "Hacklebarney State Park" },
  { id: 11, name: "Jenny Jump State Forest" },
  { id: 12, name: "Norvin Green State Forest" }
];

const EditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [completedTrails, setCompletedTrails] = useState({});
  const [trailSelfies, setTrailSelfies] = useState({});
  const [trailBios, setTrailBios] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setBio(data.bio || '');
        setProfileImage(data.profileImageUrl || null);
        setCompletedTrails(data.completedTrails || {});
        setTrailSelfies(data.trailSelfies || {});
        setTrailBios(data.trailBios || {});
      }
    };
    fetchProfile();
  }, []);

  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleTrailCheck = (trailId) => {
    setCompletedTrails(prev => ({
      ...prev,
      [trailId]: !prev[trailId]
    }));
  };

  const handleTrailSelfieChange = (trailId, file) => {
    setTrailSelfies(prev => ({
      ...prev,
      [trailId]: file
    }));
  };

  const handleTrailBioChange = (trailId, value) => {
    setTrailBios(prev => ({
      ...prev,
      [trailId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    let profileImageUrl = profileImage;
    // Upload profile image if it's a File
    if (profileImage && profileImage instanceof File) {
      const imageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
      await uploadBytes(imageRef, profileImage);
      profileImageUrl = await getDownloadURL(imageRef);
    }

    // Upload trail selfies
    const selfiesUrls = { ...trailSelfies };
    for (const trailId in trailSelfies) {
      if (trailSelfies[trailId] instanceof File) {
        const selfieRef = ref(storage, `trailSelfies/${auth.currentUser.uid}/${trailId}`);
        await uploadBytes(selfieRef, trailSelfies[trailId]);
        selfiesUrls[trailId] = await getDownloadURL(selfieRef);
      }
    }

    await setDoc(doc(db, 'users', auth.currentUser.uid), {
      firstName,
      lastName,
      bio,
      profileImageUrl,
      completedTrails,
      trailSelfies: selfiesUrls,
      trailBios
    });

    alert('Profile updated!');
    navigate('/profile');
  };

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h2>Edit Profile</h2>
      <label>
        First Name:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
      </label>
      <label>
        Last Name:
        <input value={lastName} onChange={e => setLastName(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
      </label>
      <label>
        Bio:
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} style={{ width: '100%', marginBottom: 12 }} />
      </label>
      <label>
        Profile Image:
        <input type="file" accept="image/*" onChange={handleProfileImageChange} style={{ display: 'block', marginBottom: 12 }} />
      </label>
      {profileImage && typeof profileImage === 'string' && (
        <img src={profileImage} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 12 }} />
      )}
      <h3>Trail Checklist</h3>
      <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #eee', padding: 10, borderRadius: 8, marginBottom: 16 }}>
        {trails.map(trail => (
          <div key={trail.id} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
            <label>
              <input
                type="checkbox"
                checked={!!completedTrails[trail.id]}
                onChange={() => handleTrailCheck(trail.id)}
                style={{ marginRight: 8 }}
              />
              {trail.name}
            </label>
            {completedTrails[trail.id] && (
              <div style={{ marginLeft: 24, marginTop: 8 }}>
                <label>
                  Upload Selfie:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleTrailSelfieChange(trail.id, e.target.files[0])}
                    style={{ display: 'block', marginBottom: 8 }}
                  />
                </label>
                <label>
                  Trail Bio:
                  <textarea
                    value={trailBios[trail.id] || ''}
                    onChange={e => handleTrailBioChange(trail.id, e.target.value)}
                    rows={2}
                    style={{ width: '100%' }}
                  />
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
      <button type="submit" style={{ marginTop: 20, padding: '10px 24px', borderRadius: 8, background: '#2e5339', color: '#fff', border: 'none', fontWeight: 'bold' }}>Save Profile</button>
    </form>
  );
};

export default EditProfile;