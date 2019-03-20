const express = require('express');
const routes = express.Router();

const dbUsers = require('../data/helpers/userDb');
const { formatName } = require('../middleware');

const url = '/api/users';
const urlByUser = '/api/users/:id';
const postsByUser = '/api/users/:id/posts';

routes.use(express.json());

// GET ALL USERS
routes.get(url, (req, res) => {
  dbUsers.get()
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
  dbUsers.getById(id)
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
  dbUsers.getUserPosts(id)
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

// ADD USER
routes.post(url, formatName, (req, res) => {
  const user = req.body;
  dbUsers.insert(user)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(() => {
      res.status(500).json({ message: 'The user could not be added' });
    });
});

// DELETE USER
routes.delete(urlByUser, (req, res) => {
  const { id } = req.params;
  dbUsers.remove(id)
    .then(count => {
      if (count) {
        res.status(200).json({ message: 'User successfully deleted' });
      } else {
        res.status(404).json({ message: 'No user exists with this id' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'The user could not be removed' });
    });
});

// UPDATE USER
routes.put(urlByUser, (req, res) => {
  const { id } = req.params;
  const user = req.body;

  if (user.name) {
    dbUsers.update(id, user)
      .then(count => {
        if (count) {
          res.status(200).json({ message: 'User successfully updated' });
        } else {
          res.status(404).json({ message: 'No user exists with  this id' });
        }
      })
      .catch(() => {
        res.status(500).json({ message: 'The user could not be removed' });
      });
  } else {
    res
      .status(404)
      .json({ message: 'Please provide an updated name to change this user' });
  }
});

module.exports = routes;
