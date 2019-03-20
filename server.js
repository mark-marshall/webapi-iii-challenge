const express = require('express');
const server = express();

const userRoutes = require('./routes/users');

server.use(userRoutes);

module.exports = server;
