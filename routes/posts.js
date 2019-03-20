const express = require('express');
const routes = express.Router();

const dbPosts = require('../data/helpers/postDb');
const dbUsers = require('../data/helpers/userDb');

const url = '/api/posts';
const urlByPost = '/api/posts/:id';

routes.use(express.json());

// GET ALL POSTS
routes.get(url, (req, res) => {
  dbPosts
    .get()
    .then(posts => {
      if (posts.length > 0) {
        res.status(200).json(posts);
      } else {
        res.status(200).json({ message: 'There are no posts yet!' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'The posts could not be retrieved' });
    });
});

// GET POST BY ID
routes.get(urlByPost, (req, res) => {
  const { id } = req.params;
  dbPosts
    .getById(id)
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

// DELETE POST
routes.delete(urlByPost, (req, res) => {
  const { id } = req.params;
  dbPosts
    .remove(id)
    .then(count => {
      if (count === 1) {
        res.status(204).json({ message: 'Post successfully deleted' });
      } else {
        res.status(404).json({ message: 'No post exists with this id' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'The post could not be deleted' });
    });
});

// ADD POST
routes.post(url, (req, res) => {
  const post = req.body;
  if (post.text && post.user_id) {
    dbPosts
      .insert(post)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(() => {
        res.status(500).json({ message: 'The post could not be added' });
      });
  } else {
    res.status(404).json({ message: 'Please supply a post text and user id' });
  }
});

// UPDATE POST
routes.put(urlByPost, (req, res) => {
  const { id } = req.params;
  const post = req.body;

  if (post.text || post.user_id) {
    dbPosts
      .update(id, post)
      .then(count => {
        if (count) {
          res.status(200).json({ message: 'Post succesfully updated' });
        } else {
          res.status(404).json({ message: 'This post does not exist' });
        }
      })
      .catch(() => {
        res.status(500).json({
          message:
            'The user youre trying to associate with this post does not exist',
        });
      });
  } else {
    res
      .status(404)
      .json({ message: 'Please supply an updated post text or user id' });
  }
});

module.exports = routes;
