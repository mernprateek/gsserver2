const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Model
const Blog = require('../models/Blog');

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Get a single blog post
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new blog post
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;

    try {
      const blog = new Blog({
        title,
        content,
      });

      await blog.save();

      res.status(201).json({ message: 'Blog post created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
);

// Update a blog post
router.put(
  '/:id',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { title, content },
        { new: true }
      );

      if (!updatedBlog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }

      res.json({ message: 'Blog post updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
);

// Delete a blog post
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
