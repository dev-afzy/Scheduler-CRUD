const ModelService = require('./modelService');
const ErrorHandler = require('../app/helpers/ErrorHandler');
const { labelList } = require('../utilities/constant');
class UserService extends ModelService {
  constructor(model) {
    super(model);
    this.Model = model;
  }

  /**
   * Authenticate user
   * @param {string} userName
   * @param {string} password
   * @returns {Promise<User>}
   * */
  async authenticate(userName, password) {
    const user = await this.Model.findOne({ userName });
    if (!user) throw new Error(`Username: ${userName} does not exist`, 404);
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) throw new ErrorHandler(labelList.invalidUser, 401);
    return user;
  }
}

module.exports = UserService;
