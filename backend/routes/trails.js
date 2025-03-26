const express = require('express');
const router = express.Router();

// Example Trail Data (Replace with DB Later)
const trails = [
  { id: 1, name: "Appalachian Trail", location: "USA", difficulty: "Hard" },
  { id: 2, name: "Pacific Crest Trail", location: "USA", difficulty: "Hard" },
  { id: 3, name: "John Muir Trail", location: "California", difficulty: "Moderate" },
];

router.get('/', (req, res) => {
  res.json(trails);
});

module.exports = router;
