const mongoose = require('mongoose');
const debug = require('debug')('scheduler-api:database');
const { mongodb } = require('../config/config');

const dbOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const connectDb = () => mongoose.connect(mongodb.DATABASE_URL, dbOpts);
mongoose.set('useCreateIndex', true);

// CONNECTION EVENTS

// When successfully connected
mongoose.connection.on('connected', () => {
  debug(`Mongoose default connection open to ${mongodb.DATABASE_URL}`);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  debug(`Mongoose default connection error: ${err.message}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  debug('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    debug('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = connectDb;
