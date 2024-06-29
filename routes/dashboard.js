// routes/dashboard.js

const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth'); // Import authentication middleware if needed
const Note = require('../models/Note'); // Adjust the import path based on your file structure

// Dashboard route
router.get('/', ensureAuth, async (req, res) => {
  try {
    // Fetch notes for the dashboard from the database
    const notes = await Note.find({ user: req.user.id }).lean();
    const hasNotes = notes.length > 0;

    res.render('dashboard', {
      title: 'Dashboard',
      name: req.user.firstName, // Assuming you have this in your user model
      notes,
      hasNotes
    });
  } catch (err) {
    console.error(err);
    res.render('error/500'); // Render error page in case of database fetch error
  }
});

module.exports = router;
