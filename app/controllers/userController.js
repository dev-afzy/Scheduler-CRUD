/**
 * Endpoints.
 * GET         /api/v2/user              ->  getUsers
 * POST        /api/v2/user              ->  createUser
 * GET         /api/v2/user/:id          ->  getUser
 * PUT         /api/v2/user/:id          ->  updateUser
 * DELETE      /api/v2/user/:id          ->  deleteUser
 */

const debug = require('debug')('user-api:controllers/user');
const UserService = require('../../services/userService');
const RedisService = require('../../services/redisService');
const userModel = require('../models/userModel');
const { filterResponse } = require('../helpers/queryStructure');
require('express-async-errors');

const userService = new UserService(userModel);
const redisService = new RedisService('user');
const scheduleRedisService = new RedisService('schedule');
const authRedisService = new RedisService('auth');

const userApi = {
  createUser: async (req, res, next) => {
    res.data = await userService.create(req.body);
    redisService.del();
    if (res?.data?.id) return next();
    debug('Error occurred while saving user data');
    throw new Error();
  },

  getUser: async (req, res, next) => {
    const getData = await redisService.hGet(req.params?.id);
    if (getData) {
      res.data = getData;
      return next();
    }
    res.data = await userService.getById(req.params?.id);
    redisService.hSet(req.params?.slug, res.data);
    if (res?.data) return next();
    debug('Error occurred while fetching particular user');
    throw new Error();
  },

  getUsers: async (req, res, next) => {
    const getQuery = await filterResponse(req.query);
    const getRData = await redisService.hGet(JSON.stringify(getQuery));
    if (getRData) {
      const { data: rData, count: rCount } = JSON.parse(getRData);
      res.data = { data: rData, count: rCount };
      return next();
    }
    const { data, count } = await userService.getAll(getQuery);
    await redisService.hSet(JSON.stringify(getQuery), { data, count });
    if (data) {
      res.data = { count, data };
      return next();
    } else {
      debug('Error occurred while fetching all users');
      throw new Error();
    }
  },

  updateUser: async (req, res, next) => {
    const updateData = req.body;
    res.data = await userService.updateOne(req.params.id, updateData);
    if (res?.data) {
      if (res?.data?.nModified > 0) {
        redisService.del();
      }
      return next();
    }
    debug('Error occurred while updating user');
    throw new Error();
  },

  deleteUser: async (req, res, next) => {
    const doc = await userService.deleteOne(req.params.id);
    if (doc) {
      res.data = { ok: 1, n: 1, deletedCount: 1 };
      redisService.del();
      scheduleRedisService.del();
      authRedisService.hDel(doc.id);
      return next();
    }
    debug('Error occurred while deleting user');
    throw new Error();
  },
};

module.exports = userApi;
