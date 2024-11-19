const handleAsync = require('../utils/handleAsync')

class BaseService {
  constructor(model) {
    this.model = model
  }

  async getById(id) {
    return handleAsync(this.model.findById(id))
  }

  async getOne(query) {
    return handleAsync(this.model.findOne(query))
  }

  async create(data) {
    return handleAsync(this.model.create(data))
  }

  async update(id, updateData) {
    return handleAsync(this.model.findByIdAndUpdate(id, updateData, { new: true }))
  }

  async delete(id) {
    return handleAsync(this.model.findByIdAndDelete(id))
  }

  async getAll(query = {}) {
    return handleAsync(this.model.find(query))
  }
}

module.exports = BaseService
