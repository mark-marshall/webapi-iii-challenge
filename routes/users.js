const express = require('express');
const routes = express.Router();

const dbUsers = require('../data/helpers/userDb');
const dbPosts = require('../data/helpers/postDb');
const { formatName } = require('../middleware');

const url = '/api/users';
const urlByUser = '/api/users/:id';
const postsByUser = '/api/users/:id/posts';

routes.use(express.json());

// GET ALL USERS
routes.get(url, (req, res) => {
  dbUsers
    .get()
    .then(users => {
      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        res.status(200).json({ message: 'There are no users yet!' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'The users could not be retrieved' });
    });
});

// GET SPECIFIC USERS BY ID
routes.get(urlByUser, (req, res) => {
  const { id } = req.params;
  dbUsers
    .getById(id)
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
  dbUsers
    .getUserPosts(id)
    .then(posts => {
      if (posts.length > 0) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({
          message: 'No user exists with this id or this user has no posts',
        });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'The users could not be retrieved' });
    });
});

// ADD USER
routes.post(url, formatName, (req, res) => {
  const user = req.body;
  dbUsers
    .insert(user)
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
  deleteAllPosts(id);

  function deleteAllPosts(id) {
    dbUsers
      .getUserPosts(id)
      .then(posts => {
        if (posts.length > 0) {
          posts.forEach(post => {
            dbPosts
              .remove(post.id)
              .then(() => {})
              .catch(() => {
                res.status(400).json({ message: 'Error deleting user post' });
              });
          });
        }
      })
      .catch(() => {})
      .finally(() => removeUser(id));
  }

  function removeUser(id) {
    dbUsers
      .remove(id)
      .then(count => {
        if (count) {
          res.status(204).send({ message: 'User successfully deleted' });
        } else {
          res
            .status(400)
            .json({ message: 'The  user you tried to delete does not exist' });
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ message: 'There was a problem deleting the user' });
      });
  }
});

// UPDATE USER
routes.put(urlByUser, (req, res) => {
  const { id } = req.params;
  const user = req.body;

  if (user.name) {
    dbUsers
      .update(id, user)
      .then(count => {
        if (count) {
          res.status(404).json({ message: 'User deleted successfully' });
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
