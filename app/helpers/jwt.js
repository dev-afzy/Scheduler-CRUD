const jwt = require('jsonwebtoken');
const ErrorHandler = require('../helpers/ErrorHandler');
const { labelList } = require('../../utilities/constant');
const { jwt: jwtSecret } = require('../../config/config');

const jwtHelper = {
  // Create a new token
  createToken: (id, secretType, time) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { id },
        jwtSecret[secretType],
        { expiresIn: time },
        (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token);
        }
      );
    });
  },

  // Verify a token
  verifyToken: async (token, secret = 'secret') => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret[secret], (err, decoded) => {
        if (err) {
          throw new ErrorHandler(labelList.invalidToken, 401);
        }
        resolve(decoded);
      });
    });
  },
};

module.exports = jwtHelper;
