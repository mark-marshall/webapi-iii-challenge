const express = require('express');
const server = express();

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

server.use(userRoutes);
server.use(postRoutes);

module.exports = server;
