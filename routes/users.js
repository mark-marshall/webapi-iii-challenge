const express = require('express');
const routes = express.Router();

const db = require('../data/helpers/userDb');
const url = '/api/users';

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

module.exports = routes;
