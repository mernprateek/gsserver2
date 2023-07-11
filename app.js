
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const JWT_SECRET = 'Prateek@jggio';

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');


const app = express();


app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://Prateek:EjCOPVeGUt3mVxBR@cluster0.ukgaesh.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});




const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
};



app.use('/auth', authRoutes);
app.use('/blogs', authMiddleware, blogRoutes);

app.listen(8000, () => {
  console.log('Server started on port 8000');
});
