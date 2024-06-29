const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Note = require('../models/Note');
const Video = require('../models/Video'); //just trying to see if it works

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'layouts/login-layout',
  });
});

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).lean();
    res.render('dashboard', {
      layout: 'layouts/main-layout',
      name: req.user.firstName,
      notes,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      layout: 'layouts/main-layout',
    });
  }
});

module.exports = router;
