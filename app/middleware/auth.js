const { labelList } = require('../../utilities/constant');
const jwtHelper = require('../helpers/jwt');
const RedisService = require('../../services/redisService');
const ErrorHandler = require('../helpers/ErrorHandler');

const redisService = new RedisService('auth');

const auth = {
  // Middleware for check the user is authorized to access the resource
  isAuthorized: async (req, res, next) => {
    const forgotPassword = req.query?.forgotPassword;
    if (!forgotPassword) {
      const authHeader = req.headers?.authorization;
      const token = authHeader?.split(' ')[1];
      if (!token) throw new ErrorHandler(labelList.invalidToken, 401);
      const user = await jwtHelper.verifyToken(token);
      if (!user) throw new ErrorHandler(labelList.invalidToken, 403);
      const checkUser = await redisService.hExists(user.id);
      if (!checkUser || checkUser <= 0)
        throw new ErrorHandler(labelList.userNotExist, 404);
      req.user = user.id;
      return next();
    } else {
      return next();
    }
  },
};

module.exports = auth;
