const express = require('express');
const routes = express.Router();

const db = require('../data/helpers/userDb');
const url = '/api/users';
const urlByUser = '/api/users/:id';
const postsByUser = '/api/users/:id/posts';

routes.use(express.json());

// GET ALL USERS
routes.get(url, (req, res) => {
  db.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(() => {
      res.status(500).json({ message: 'The users could not be retrieved' });
    });
});

// GET SPECIFIC USERS BY ID
routes.get(urlByUser, (req, res) => {
  const { id } = req.params;
  db.getById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'No user exists with this id' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'The users could not be retrieved' });
    });
});

// GET ALL POSTS BY A USER
routes.get(postsByUser, (req, res) => {
  const { id } = req.params;
  db.getUserPosts(id)
    .then(posts => {
      if (posts.length > 0) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: 'No user exists with this id' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'The users could not be retrieved' });
    });
});

module.exports = routes;
