const logger = require('../config/logger');

/**
 * Base Repository Class
 * Implements common CRUD operations using Repository Pattern
 * All specific repositories extend this base class
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @returns {Promise<Document>}
   */
  async create(data) {
    try {
      const document = await this.model.create(data);
      logger.info(`Created ${this.model.modelName}: ${document._id}`);
      return document;
    } catch (error) {
      logger.error(`Error creating ${this.model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Find document by ID
   * @param {string} id - Document ID
   * @param {Object} options - Query options (populate, select, etc.)
   * @returns {Promise<Document|null>}
   */
  async findById(id, options = {}) {
    try {
      let query = this.model.findById(id);

      if (options.populate) {
        query = query.populate(options.populate);
      }

      if (options.select) {
        query = query.select(options.select);
      }

      return await query.exec();
    } catch (error) {
      logger.error(`Error finding ${this.model.modelName} by ID:`, error);
      throw error;
    }
  }

  /**
   * Find one document by criteria
   * @param {Object} criteria - Search criteria
   * @param {Object} options - Query options
   * @returns {Promise<Document|null>}
   */
  async findOne(criteria, options = {}) {
    try {
      let query = this.model.findOne(criteria);

      if (options.populate) {
        query = query.populate(options.populate);
      }

      if (options.select) {
        query = query.select(options.select);
      }

      return await query.exec();
    } catch (error) {
      logger.error(`Error finding ${this.model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Find all documents matching criteria
   * @param {Object} criteria - Search criteria
   * @param {Object} options - Query options (sort, limit, skip, populate)
   * @returns {Promise<Document[]>}
   */
  async find(criteria = {}, options = {}) {
    try {
      let query = this.model.find(criteria);

      if (options.sort) {
        query = query.sort(options.sort);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.skip) {
        query = query.skip(options.skip);
      }

      if (options.populate) {
        query = query.populate(options.populate);
      }

      if (options.select) {
        query = query.select(options.select);
      }

      return await query.exec();
    } catch (error) {
      logger.error(`Error finding ${this.model.modelName} documents:`, error);
      throw error;
    }
  }

  /**
   * Find documents with pagination
   * @param {Object} criteria - Search criteria
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} - { data, pagination }
   */
  async findWithPagination(criteria = {}, options = {}) {
    try {
      const page = parseInt(options.page) || 1;
      const limit = parseInt(options.limit) || 10;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.find(criteria, { ...options, skip, limit }),
        this.count(criteria),
      ]);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error(`Error in paginated find for ${this.model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Update document by ID
   * @param {string} id - Document ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Document|null>}
   */
  async updateById(id, data, options = {}) {
    try {
      const document = await this.model.findByIdAndUpdate(
        id,
        data,
        {
          new: true, // Return updated document
          runValidators: true, // Run schema validators
          ...options,
        }
      );

      if (document) {
        logger.info(`Updated ${this.model.modelName}: ${id}`);
      }

      return document;
    } catch (error) {
      logger.error(`Error updating ${this.model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Update one document by criteria
   * @param {Object} criteria - Search criteria
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Document|null>}
   */
  async updateOne(criteria, data, options = {}) {
    try {
      return await this.model.findOneAndUpdate(
        criteria,
        data,
        {
          new: true,
          runValidators: true,
          ...options,
        }
      );
    } catch (error) {
      logger.error(`Error updating ${this.model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Delete document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Document|null>}
   */
  async deleteById(id) {
    try {
      const document = await this.model.findByIdAndDelete(id);
      
      if (document) {
        logger.info(`Deleted ${this.model.modelName}: ${id}`);
      }

      return document;
    } catch (error) {
      logger.error(`Error deleting ${this.model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Delete one document by criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Document|null>}
   */
  async deleteOne(criteria) {
    try {
      return await this.model.findOneAndDelete(criteria);
    } catch (error) {
      logger.error(`Error deleting ${this.model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Count documents matching criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<number>}
   */
  async count(criteria = {}) {
    try {
      return await this.model.countDocuments(criteria);
    } catch (error) {
      logger.error(`Error counting ${this.model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Check if document exists
   * @param {Object} criteria - Search criteria
   * @returns {Promise<boolean>}
   */
  async exists(criteria) {
    try {
      const count = await this.count(criteria);
      return count > 0;
    } catch (error) {
      logger.error(`Error checking existence for ${this.model.modelName}:`, error);
      throw error;
    }
  }
}

module.exports = BaseRepository;
