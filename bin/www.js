#!/usr/bin/env node

// Module dependencies.
require('dotenv').config();
const http = require('http');
const debug = require('debug')('scheduler-api:server');
const app = require('../app');

// Redis connection
require('../database/redisConnection');

// Importing DB requirements
const connectDb = require('../database/mongoConnection');

// Setting PORT
let port = '36200';

// Event listener for HTTP server "error" event.
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      debug(`Port ${port} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debug(`Port ${port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Get port from environment and store in Express.
port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Listen to the port
const onListening = () => {
  const addr = server.address();
  debug(`Listening on port ${addr.port}`);
};

// Listen on provided port, on all network interfaces.
connectDb()
  .then(async () => {
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  })
  .catch((err) => {
    debug(`Server not started ${err.message}`);
  });
