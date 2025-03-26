function TrailCard({ trail }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-100 hover:scale-[1.02] hover:shadow-xl transition-transform">
      <img
        src={trail.image}
        alt={trail.name}
        className="w-full h-40 object-cover rounded-md mb-3"
      />
      <h2 className="text-xl font-semibold text-gray-800">{trail.name}</h2>
      <p className="text-sm text-gray-600">{trail.location}</p>
      <span
        className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
          trail.difficulty === 'Hard'
            ? 'bg-red-100 text-red-700'
            : trail.difficulty === 'Moderate'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-green-100 text-green-700'
        }`}
      >
        {trail.difficulty}
      </span>
      <label className="mt-4 block text-sm text-gray-700">
        <input type="checkbox" className="mr-2" /> Mark as completed
      </label>
    </div>
  );
}

export default TrailCard;
