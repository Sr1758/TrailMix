import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [hikes, setHikes] = useState([]);
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [weather, setWeather] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHikes = async (userId) => {
    const hikesRef = collection(db, 'users', userId, 'hikes');
    const snapshot = await getDocs(hikesRef);
    const hikesData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    hikesData.sort((a, b) => new Date(b.date) - new Date(a.date));

    setHikes(hikesData);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchHikes(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const hike = {
      date: Timestamp.fromDate(new Date(date)),
      duration,
      weather,
      difficulty,
      description
    };

    try {
      const hikesRef = collection(db, 'users', user.uid, 'hikes');
      await addDoc(hikesRef, hike);

      await fetchHikes(user.uid);

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        trailsCompleted: hikes.length + 1
      });

      setDate('');
      setDuration('');
      setWeather('');
      setDifficulty(1);
      setDescription('');
    } catch (err) {
      console.error('Error adding hike:', err);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-background">
        <div className="dashboard-container">
          <h2>Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-background">
      <div className="dashboard-container">
        <h1 className="dashboard-title">TrailMixer Dashboard</h1>

        {/* Summary Card */}
        <div className="summary-card">
          <h2>Your Progress</h2>
          <p>Trails Completed: {hikes.length}</p>
        </div>

        {/* Trail Logging Form */}
        <div className="trail-log-form">
          <h2>Log a New Hike</h2>
          <form className="trail-form" onSubmit={handleSubmit}>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="trail-input"
              required
            />
            <input
              type="text"
              placeholder="Duration (e.g., 2 hours)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="trail-input"
              required
            />
            <input
              type="text"
              placeholder="Weather (e.g., Sunny)"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="trail-input"
              required
            />
            <textarea
              placeholder="Tell us about your hike..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="trail-textarea"
            ></textarea>

            <div className="difficulty-container">
              <span className="difficulty-label">Difficulty:</span>
              <div className="difficulty-options">
                {[1, 2, 3, 4, 5].map((level) => (
                  <label key={level} className="difficulty-option">
                    <input
                      type="radio"
                      name="difficulty"
                      value={level}
                      checked={difficulty === level}
                      onChange={() => setDifficulty(level)}
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="submit-button">
              Submit Hike Log
            </button>
          </form>
        </div>

        {/* List of Hikes */}
        <div className="trails-grid">
          {hikes.map((hike) => (
            <div key={hike.id} className="trail-card">
              <h3>
                {hike.date
                  ? (hike.date.toDate
                      ? hike.date.toDate().toLocaleDateString()
                      : new Date(hike.date).toLocaleDateString())
                  : 'Unknown Date'}
              </h3>
              <p>Duration: {hike.duration}</p>
              <p>Weather: {hike.weather}</p>
              <p>Difficulty: {hike.difficulty}</p>
              <p>{hike.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;