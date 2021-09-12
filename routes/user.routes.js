const router = require('express').Router();
const userApi = require('../app/controllers/userController');
const middlewareResponse = require('../app/middleware/response');
const auth = require('../app/middleware/auth');

// CREATE NEW USER ROUTE
router.post('/', userApi.createUser, middlewareResponse.saveResponse);

// GET ALL USERS ROUTE
router.get(
  '/',
  auth.isAuthorized,
  userApi.getUsers,
  middlewareResponse.getAllResponse
);

// GET USER BY ID ROUTE
router.get(
  '/:id',
  auth.isAuthorized,
  userApi.getUser,
  middlewareResponse.getByIdResponse
);

// UPDATE USER ROUTE
router.put(
  '/:id',
  auth.isAuthorized,
  userApi.updateUser,
  middlewareResponse.updateResponse
);

// DELETE USER ROUTE
router.delete(
  '/:id',
  auth.isAuthorized,
  userApi.deleteUser,
  middlewareResponse.deleteResponse
);

module.exports = router;
