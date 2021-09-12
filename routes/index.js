const express = require('express');
const router = express.Router();
const AuthApi = require('../app/controllers/authController');
const middlewareResponse = require('../app/middleware/response');
const auth = require('../app/middleware/auth');
const authApi = new AuthApi();

router.get('/', (req, res) => {
  res.send('SCHEDULE API Version 2');
});

// LOGIN ROUTE
router.post('/login', authApi.logIn, middlewareResponse.authResponse);
router.delete(
  '/logout',
  auth.isAuthorized,
  authApi.logOut,
  middlewareResponse.getAllResponse
);

// REFRESH TOKEN ROUTE
router.post('/token', authApi.refreshToken, middlewareResponse.authResponse);

// FORGOT PASSWORD LINK ROUTE
router.put(
  '/forgot-password',
  authApi.forgotPassword,
  middlewareResponse.resetPassword
);

// RESET PASSWORD ROUTE, ( Pass query params with 'forgotPassword' status true if the reset the password API coming from forgot password) and no need to pass token and query params in case of reset password from profile page)
router.put(
  '/reset-password',
  auth.isAuthorized,
  authApi.resetPassword,
  middlewareResponse.resetPassword
);

router.use('/schedule', require('./schedule.routes'));
router.use('/user', require('./user.routes'));

router.use((err, req, res) => {
  if (err)
    res.status(500).json({
      status: false,
      error: 'Something went wrong',
    });
});
module.exports = router;
