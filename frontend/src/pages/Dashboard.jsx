import React from "react";
import '../styles/Dashboard.css';
import TrailCard from "../TrailCard";

const Dashboard = ({ trails }) => {
  const completed = trails.filter((trail) => trail.completed);
  const percentDone = trails.length > 0 ? Math.round((completed.length / trails.length) * 100) : 0;

  return (
    <div className="dashboard-background">
      <div className="dashboard-overlay">
        <div className="dashboard-container">
          <h1 className="dashboard-title">TrailMixer Dashboard</h1>

          {/* Summary Card */}
          <div className="summary-card">
            <h2>Your Progress</h2>
            <p>Trails Completed: {completed.length}</p>
            <p>Total Trails: {trails.length}</p>
            <p className="percent">{percentDone}% Done</p>
          </div>

          {/* Trail Logging Form */}
          <div className="trail-log-form">
            <h2>Log a New Hike</h2>
            <form className="trail-log-form-fields">
              <input
                type="datetime-local"
                placeholder="Date"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 2 hours)"
              />
              <input
                type="text"
                placeholder="Weather (e.g., Sunny)"
              />
              <textarea
                placeholder="Tell us about your hike..."
              ></textarea>

              <div className="difficulty-container">
                <span className="difficulty-label">Difficulty:</span>
                <div className="difficulty-options">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <label key={level} className="difficulty-option">
                      <input type="radio" name="difficulty" value={level} />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
              />
              <button type="submit">
                Submit Hike Log
              </button>
            </form>
          </div>

          {/* Trails Display */}
          <div className="trails-grid">
            {trails.map((trail) => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;