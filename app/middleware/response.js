const { labelList } = require('../../utilities/constant');

const ResponseMiddleWare = {
  // Middleware to handle the Save response
  saveResponse: async (req, res) => {
    if (res.data) {
      return res.status(201).json({ success: true, id: res.data._id });
    }
    return res
      .status(500)
      .json({ status: false, message: labelList.serverError });
  },

  // Middleware to handle the response by id
  getByIdResponse: async (req, res) => {
    if (res.data) {
      return res.status(200).json(res.data);
    }
    return res
      .status(404)
      .json({ success: true, message: labelList.invalidInput });
  },

  // Middleware to handle the All response
  getAllResponse: async (req, res) => {
    if (res.data) {
      return res
        .status(200)
        .json({ success: true, count: res.data.count, data: res.data.data });
    }
    return res
      .status(500)
      .json({ success: false, message: labelList.serverError });
  },

  // Middleware to handle the Update response
  updateResponse: async (req, res) => {
    if (res.data) {
      return res
        .status(200)
        .json({ success: true, modifiedCount: res.data.nModified });
    }
    return res
      .status(500)
      .json({ success: false, message: labelList.serverError });
  },

  // Middleware to handle the Delete response
  deleteResponse: async (req, res) => {
    if (res.data) {
      return res
        .status(200)
        .json({ success: true, deletedCount: res.data.deletedCount });
    }
    return res
      .status(500)
      .json({ success: false, message: labelList.serverError });
  },

  // Middleware to handle the Reset Password response
  resetPassword: async (req, res) => {
    if (res.data) {
      return res.status(201).json({ success: true, message: res.data.message });
    }

    return res
      .status(500)
      .json({ success: false, message: labelList.serverError });
  },

  // Middleware to handle the Authentication response
  authResponse: async (req, res) => {
    if (res?.data) {
      return res.status(200).json({
        success: true,
        user: res.data?.user,
        token: res.data?.token,
        refreshToken: res.data?.refreshToken,
      });
    }
    return res
      .status(500)
      .json({ success: false, message: labelList.serverError });
  },
};
module.exports = ResponseMiddleWare;
