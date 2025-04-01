import React from "react";
import './styles/Dashboard.css'
import TrailCard from "./TrailCard";

const Dashboard = ({ trails }) => {
  const completed = trails.filter((trail) => trail.completed);
  const percentDone = Math.round((completed.length / trails.length) * 100);

  return (
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
        <form className="flex flex-col gap-4">
          <input
            type="datetime-local"
            className="input input-bordered w-full"
            placeholder="Date"
          />
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Duration (e.g., 2 hours)"
          />
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Weather (e.g., Sunny)"
          />
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Tell us about your hike..."
          ></textarea>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Difficulty:</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <label key={level} className="flex items-center gap-1">
                  <input type="radio" name="difficulty" value={level} />
                  {level}
                </label>
              ))}
            </div>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept="image/*"
          />
          <button type="submit" className="btn btn-success w-full">
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
  );
};

export default Dashboard;