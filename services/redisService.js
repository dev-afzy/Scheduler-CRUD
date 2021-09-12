const debug = require('debug')('scheduler-api:redisService');
const client = require('../database/redisConnection');
class RedisService {
  constructor(parentKey) {
    this.parentKey = parentKey;
  }

  /**
   * Get value from Redis DB using key
   * @param  {String} key
   * @return {Promise}
   *
   * */
  hGet(key = '') {
    const _key = typeof key === 'string' ? key : key.toString();
    return new Promise((resolve, reject) => {
      client.hget(this.parentKey, _key, (err, reply) => {
        if (err) {
          debug('Error: ', err);
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  /**
   * Del key from Redis DB
   * @param  {String} key
   * @return {Promise}
   * */
  hDel(key = '') {
    const _key = typeof key === 'string' ? key : key.toString();
    return new Promise((resolve, reject) => {
      client.hdel(this.parentKey, _key, (err, reply) => {
        if (err) {
          debug('Error: ', err);
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  /**
   * Set value to Redis DB using key
   * @param  {String} key
   * @param  {String} value
   * @param {number} exTime
   * @return {Promise}
   * */
  hSet(key, value, exTime = 300) {
    const _key = typeof key === 'string' ? key : key.toString();
    const _value = typeof value === 'string' ? value : JSON.stringify(value);
    return new Promise((resolve, reject) => {
      client.hset(this.parentKey, _key, _value, 'EX', exTime, (err, reply) => {
        if (err) {
          debug('Error: ', err);
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  /**
   * Check the key with field is exist or not
   * @param  {String} key
   * @return {Promise}
   * */
  hExists(key, value, exTime = 300) {
    const _key = typeof key === 'string' ? key : key.toString();
    return new Promise((resolve, reject) => {
      client.hexists(this.parentKey, _key, (err, reply) => {
        if (err) {
          debug('Error: ', err);
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  /**
   * Delete All Fields with respctive key
   * @return {Promise}
   * */
  del() {
    return new Promise((resolve, reject) => {
      client.del(this.parentKey, (err, reply) => {
        if (err) {
          debug('Error: ', err);
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

module.exports = RedisService;
