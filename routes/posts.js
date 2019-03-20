const express = require('express');
const routes = express.Router();

const db = require('../data/helpers/postDb');

const url = '/api/posts';
const urlByPost = '/api/posts/:id';

routes.use(express.json());

// GET ALL POSTS
routes.get(url, (req, res) => {
  db.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res.status(500).json({ message: 'The posts could not be retrieved' });
    });
});

// GET POST BY ID
routes.get(urlByPost, (req, res) => {
  const { id } = req.params;
  db.getById(id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'No post exists with this id' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'The post could not be retrieved' });
    });
});

module.exports = routes;
