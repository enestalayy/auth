const handleAsync = require('../utils/handleAsync')

class BaseService {
  constructor(model) {
    this.model = model
  }

  async getById(id) {
    return this.model.findById(id)
  }

  async getOne(query) {
    return this.model.findOne(query)
  }

  async create(data) {
    return this.model.create(data)
  }

  async update(id, updateData) {
    return this.model.findByIdAndUpdate(id, updateData, { new: true })
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id)
  }

  async findOneAndUpdate(query, updateData, options = { new: true }) {
    return this.model.findOneAndUpdate(query, updateData, options)
  }

  async deleteOne(query) {
    return this.model.deleteOne(query)
  }

  async getAll(query = {}) {
    return this.model.find(query)
  }
}

module.exports = BaseService
