/**
 * Endpoints.
 * POST        /api/v2/login             ->  login
 * DELETE      /api/v2/logout            ->  logout
 * PUT         /api/v2/reset-password    ->  resetPassword
 * GET         /api/v2/token             ->  refreshToken
 * POST        /api/v2/forgot-password   ->  forgotPassword
 */

const debug = require('debug')('user-api:controllers/user');
const bcrypt = require('bcrypt');
const UserService = require('../../services/userService');
const RedisService = require('../../services/redisService');
const ErrorHandler = require('../helpers/ErrorHandler');
const MailService = require('../../services/mailService');
const jwtHelper = require('../helpers/jwt');
const userModel = require('../models/userModel');
const { labelList } = require('../../utilities/constant');
const { api } = require('../../config/config');

require('express-async-errors');

const userService = new UserService(userModel);
const redisService = new RedisService('auth');

class AuthApi {
  async logIn(req, res, next) {
    const { userName, password } = req.body;
    const response = await userService.authenticate(userName, password);
    if (response) {
      if (response?.error) {
        res.data = response;
        debug(response.error);
        return next();
      }
      const token = await jwtHelper.createToken(response._id, 'secret', '15m');
      const refreshToken = await jwtHelper.createToken(
        response._id,
        'refreshToken',
        '1d'
      );
      await redisService.hDel(response._id);
      // Refresh token will valid for 1 day
      await redisService.hSet(response._id, refreshToken, 86400);
      res.data = { token, user: response, refreshToken };
      return next();
    }
    debug('Error occurred while logging in user');
    throw new Error();
  }

  async logOut(req, res, next) {
    const user = await redisService.hDel(req.user._id);
    if (user) {
      res.data = { success: true, message: labelList.logoutMessage };
      return next();
    }
    debug('Error occurred while logging out user');
    throw new Error();
  }

  async forgotPassword(req, res, next) {
    const { email } = req.body;
    const user = await userService.getByKey({ email });
    if (!user || user.length <= 0)
      throw new ErrorHandler(labelList.userNotExist, 400);
    const token = await jwtHelper.createToken(
      user[0]._id,
      'passwordResetToken',
      '15m'
    );
    const messageData = {
      to: user[0].email,
      subject: 'Reset Password',
      html: `<p>Hello,</p><p>Please click the link below to reset your password.</p><p><a href="${api.baseUrl}/reset-password/${token}"> ${api.baseUrl}/reset-password/${token}</a></p><p>If you did not request this email, please ignore it.</p><p>Thanks,</p><p>Scheduler</p>`,
    };
    const updateResetToken = await userService.updateOne(user[0]._id, {
      resetToken: token,
    });
    if (!updateResetToken || updateResetToken.nModified <= 0)
      throw new ErrorHandler(labelList.resetPasswordLinkError, 400);
    const sendResetMail = await MailService.sendMail(messageData);
    if (!sendResetMail) throw new ErrorHandler(labelList.errorMailStatus, 403);
    if (sendResetMail) {
      res.data = { message: labelList.successMailStatus, statusCode: 200 };
      return next();
    }
  }

  async refreshToken(req, res, next) {
    const { token } = req.body;
    if (!token) throw new ErrorHandler(labelList.invalidToken, 401);
    const data = await jwtHelper.verifyToken(token, 'refreshToken');
    if (!data.id) throw new ErrorHandler(labelList.invalidToken, 401);
    const isExist = await redisService.hGet(data.id);
    if (!isExist) throw new ErrorHandler(labelList.invalidToken, 401);
    const newToken = await jwtHelper.createToken(data.id, 'secret', '1d');
    res.data = { token: newToken };
    return next();
  }

  resetPassword = async (req, res, next) => {
    const { token = null, newPassword = null, oldPassword = null } = req.body;

    // Check if token is valid in case of forgot password
    if (token && newPassword) {
      const verifyToken = await jwtHelper.verifyToken(
        token,
        'passwordResetToken'
      );
      if (!verifyToken.id) throw new ErrorHandler(labelList.invalidToken, 401);
      return this.#updatePassword(newPassword, verifyToken.id, res, next);
    }

    // Check if old password is valid in case of password reset using old password
    if (newPassword && oldPassword && token === null) {
      const userData = await userService.getById(req.user);
      if (!userData) throw new ErrorHandler(labelList.resetPasswordError, 400);
      const verifyOldPassword = await userData.isValidPassword(oldPassword);
      if (verifyOldPassword) {
        return this.#updatePassword(newPassword, req.user, res, next);
      }
      throw new ErrorHandler(labelList.incorrectPassword, 400);
    }

    // Token and old password statement is false then return error
    throw new ErrorHandler(labelList.unauthorized, 401);
  };

  async #updatePassword(newPassword, id, res, next) {
    const password = await bcrypt.hash(newPassword, 10);
    const user = await userService.updateOne(id, {
      password,
    });
    if (!user || user.nModified <= 0)
      throw new ErrorHandler(labelList.resetPasswordError, 400);
    await redisService.hDel(id);
    res.data = { message: labelList.successResetPassword, statusCode: 200 };
    return next();
  }
}

module.exports = AuthApi;
