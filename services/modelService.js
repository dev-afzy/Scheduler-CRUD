class ModelService {
  constructor(model) {
    this.Model = model;
  }

  /**
   * Save or create new record.
   * @param {Object} data
   * @return {promise<Object>} returned promise will fulfill with the document saved
   * */
  create(data) {
    const dataModel = new this.Model(data);
    return dataModel.save();
  }

  /**
   * Get record by slug.
   * @param {String} slug
   * @return {Promise<Array>}
   * */
  async getByKey(obj) {
    return this.Model.find(obj);
  }

  /**
   * Get record by id.
   * @param {String} id
   * @return {Promise<Array>}
   * */
  async getById(id) {
    return this.Model.findById(id);
  }

  /**
   * List all records with filter, sort, skip and limit.
   * @param {Object} obj
   * @return {Promise<Array>}
   * */
  async getAll(obj) {
    const query = obj.query || {};
    const skip = parseInt(obj.pageSize, 10) * (parseInt(obj.pageNo, 10) - 1);
    const limit = parseInt(obj.pageSize, 10);
    const sort = {
      [obj.sortColumn]: parseInt(obj.sortValue, 10),
    };
    const data = await this.Model.find(query)
      // .populate('users')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await this.#totalCount();
    return { data, count };
  }

  /**
   * Update one record by document ID.
   * @param {Object} data
   * @param {string} id
   * @return {Promise<object>} returned promise resolves to an object that contains 3 properties
   * ok: 1 if no errors occurred
   * nModified: the number of documents deleted
   * n: the number of documents matches.
   * */
  async updateOne(id, data) {
    return this.Model.updateOne({ _id: id }, { $set: data }).exec();
  }

  /**
   * Delete one record by doucment ID.
   * @param {Object} data
   * @param {string} id
   * @return {Promise<object>} returned promise resolves to an object that contains 3 properties
   * ok: 1 if no errors occurred
   * deletedCount: the number of documents deleted
   * n: the number of documents matches.
   * */
  async deleteOne(id) {
    const doc = await this.Model.findById(id);
    if (doc) {
      return doc.remove();
    }
    return { ok: 0, n: 0, deletedCount: 0 };
  }

  /**
   * Get count of total documents
   * @return {promise<number>} returned promise resolves to a number
   * */
  #totalCount() {
    return this.Model.countDocuments();
  }
}
module.exports = ModelService;
