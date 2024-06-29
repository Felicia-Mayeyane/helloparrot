// routes/note.js

const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth'); // Import authentication middleware if needed

// Example route for note page
router.get('/note', ensureAuth, (req, res) => {
  res.render('note', {
    title: 'Note Taking App'
    // Add any other data you need to pass to the note.ejs template
  });
});

// Add more routes related to note functionality as needed

module.exports = router;
