const Redis = require('redis');
const debug = require('debug')('scheduler-api:redis-connection');
const { redis } = require('../config/config');

const client = Redis.createClient({
  host: redis.host,
  port: redis.port,
  retry_max_delay: 3000,
});

client.on('connect', () => {
  debug('Client connected to redis...');
});

client.on('ready', () => {
  debug('Client connected to redis and ready to use...');
});

client.on('error', (err) => {
  debug(err.message);
});

client.on('end', () => {
  debug('Client disconnected from redis');
});

process.on('SIGINT', () => {
  client.quit();
});

module.exports = client;
