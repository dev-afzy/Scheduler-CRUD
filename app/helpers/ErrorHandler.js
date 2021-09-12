/**
 * @constructor
 * @param {String} message
 * @param {number} statusCode
 */
function ErrorHandler(message, statusCode) {
  this.message = message;
  this.statusCode = statusCode || 500;
  this.name = 'Error';
}

module.exports = ErrorHandler;
