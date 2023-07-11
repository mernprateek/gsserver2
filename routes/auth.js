const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const JWT_SECRET = 'Prateek@jggio';

const User = require('../models/User');


router.post(
  '/signup',
  [
    body('username')
      .isLength({ min: 5 })
      .withMessage('Username must be at least 5 characters long'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const saltRounds = 10;

    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);

   
      const user = new User({
        username,
        password: hashedPassword,
      });

      await user.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
);

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const result = await bcrypt.compare(password, user.password);

    if (result) {
      const token = jwt.sign({ username: user.username }, JWT_SECRET);
      return res.json({ token });
    }

    res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
