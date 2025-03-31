import React from "react";
import './styles/Dashboard.css'
import TrailCard from "./TrailCard";

const Dashboard = ({ trails }) => {
  const completed = trails.filter((trail) => trail.completed);
  const percentDone = Math.round((completed.length / trails.length) * 100);

  return (
    <div className="flex flex-col items-center gap-10 px-4 py-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700">TrailMix Dashboard</h1>

      {/* Summary Card */}
      <div className="card w-96 bg-white shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="text-xl font-semibold">Your Progress</h2>
          <p className="text-gray-700">Trails Completed: {completed.length}</p>
          <p className="text-gray-700">Total Trails: {trails.length}</p>
          <p className="text-lg font-bold text-green-600">{percentDone}% Done</p>
        </div>
      </div>

      {/* Trail Logging Input */}
      <div className="card w-full max-w-xl bg-white shadow-xl">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-4">Log a New Hike</h2>
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
              placeholder="Notes about your hike..."
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
      </div>

      {/* Trails Display */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trails.map((trail) => (
          <TrailCard key={trail.id} trail={trail} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;