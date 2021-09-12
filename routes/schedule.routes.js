const router = require('express').Router();
const scheduleApi = require('../app/controllers/schedule');
const middlewareResponse = require('../app/middleware/response');
const auth = require('../app/middleware/auth');

// CREATE NEW SCHEDULE ROUTE
router.post(
  '/',
  auth.isAuthorized,
  scheduleApi.createSchedule,
  middlewareResponse.saveResponse
);

// GET SCHEDULES ROUTE
router.get(
  '/',
  auth.isAuthorized,
  scheduleApi.getSchedules,
  middlewareResponse.getAllResponse
);

// GET SCHEDULE BY SLUG
router.get(
  '/:slug',
  auth.isAuthorized,
  scheduleApi.getSchedule,
  middlewareResponse.getByIdResponse
);

// UPDATE SCHEDULE ROUTE
router.put(
  '/:id',
  auth.isAuthorized,
  scheduleApi.updateSchedule,
  middlewareResponse.updateResponse
);

// DELETE SCHEDULE ROUTE
router.delete(
  '/:id',
  auth.isAuthorized,
  scheduleApi.deleteSchedule,
  middlewareResponse.deleteResponse
);

module.exports = router;
