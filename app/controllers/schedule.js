/**
 * Endpoints.
 * GET         /api/v2/schedule              ->  getSchedules
 * POST        /api/v2/schedule              ->  createSchedule
 * GET         /api/v2/schedule/:slug        ->  getSchedule
 * PUT         /api/v2/schedule/:id          ->  updateSchedule
 * DELETE      /api/v2/schedule/:id          ->  deleteSchedule
 */

const debug = require('debug')('schedule-api:controllers/schedule');
require('express-async-errors');
const modelService = require('../../services/modelService');
const scheduleModel = require('../models/schedule');
const { filterResponse } = require('../helpers/queryStructure');
const RedisService = require('../../services/redisService');
const scheduleService = new modelService(scheduleModel);
const redisService = new RedisService('schedule');

const scheduleApi = {
  createSchedule: async (req, res, next) => {
    res.data = await scheduleService.create(req.body);
    redisService.del();
    if (res?.data?.id) return next();
    debug('Error occurred while saving schedule data');
    throw new Error();
  },

  getSchedule: async (req, res, next) => {
    const slug = req.params?.slug;
    const getData = await redisService.hGet(slug);
    if (getData) {
      res.data = JSON.parse(getData);
      return next();
    }
    res.data = await scheduleService.getByKey({ slug });
    redisService.hSet(slug, res.data);
    if (res?.data) return next();
    debug('Error occurred while fetching particular schedule');
    throw new Error();
  },

  getSchedules: async (req, res, next) => {
    const getQuery = await filterResponse(req.query);
    const getData = await redisService.hGet(JSON.stringify(getQuery));
    if (getData) {
      res.data = JSON.parse(getData);
      return next();
    }
    const { data, count } = await scheduleService.getAll(getQuery);
    await redisService.hSet(JSON.stringify(getQuery), { data, count });
    if (data) {
      res.data = { count, data };
      return next();
    } else {
      debug('Error occurred while fetching all schedules');
      throw new Error();
    }
  },

  updateSchedule: async (req, res, next) => {
    const updateData = req.body;
    res.data = await scheduleService.updateOne(req.params.id, updateData);
    if (res?.data) {
      if (res?.data?.nModified > 0) {
        redisService.del();
      }
      return next();
    }
    debug('Error occurred while updating schedule');
    throw new Error();
  },

  deleteSchedule: async (req, res, next) => {
    res.data = await scheduleService.deleteOne(req.params.id);
    if (res?.data) {
      if (res?.data?.deletedCount > 0) {
        redisService.del();
      }
      return next();
    }
    debug('Error occurred while deleting schedule');
    throw new Error();
  },
};

module.exports = scheduleApi;
