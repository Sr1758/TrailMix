const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Setup Upload Folder
const uploadFolder = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Setup Multer For File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
});
const upload = multer({storage: storage});

// Example User Data
let users = {
    1: {
        id: 1,
        username: "johnsmith7",
        profile_picture: null,
        is_private: false
    }
};

// PUT /users/{user_id}
router.put('/api/users/:id', upload.single('profilePicture'), (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { username, privacySetting } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    if (!users[userId]) {
        return res.status(404).json({ error: "User not found" });
    }

    // Update user fields
    if (username) users[userId].username = username;
    if (privacySetting !== undefined) users[userId].is_private = (privacySetting === 'true');
    if (profilePicture) users[userId].profile_picture = profilePicture;

    res.json({ message: "✅ User Profile Updated Successfully!", user: users[userId] });
});

module.exports = router;