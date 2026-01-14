const dotenv = require('dotenv');
const mongoose = require('mongoose');
const logger = require('./logger');

// Load environment variables
dotenv.config();

/**
 * Database Configuration Class (Singleton Pattern)
 * Ensures only one database connection exists throughout the application
 */
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.connection = null;
    Database.instance = this;
  }

  /**
   * Connect to MongoDB database
   * @returns {Promise<mongoose.Connection>}
   */
  async connect() {
    if (this.connection) {
      logger.info('Database already connected');
      return this.connection;
    }

    try {
      const mongoUri = process.env.NODE_ENV === 'test' 
        ? process.env.MONGODB_TEST_URI 
        : process.env.MONGODB_URI;

      const options = {
        // Connection pool settings
        maxPoolSize: 10,
        minPoolSize: 5,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
        
        // Recommended settings
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };

      this.connection = await mongoose.connect(mongoUri, options);

      logger.info(`MongoDB connected successfully to ${this.connection.connection.host}`);
      
      // Handle connection events
      this.setupEventHandlers();

      return this.connection;
    } catch (error) {
      logger.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }

  /**
   * Setup database event handlers
   */
  setupEventHandlers() {
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  /**
   * Disconnect from database
   */
  async disconnect() {
    if (this.connection) {
      await mongoose.connection.close();
      this.connection = null;
      logger.info('MongoDB connection closed');
    }
  }

  /**
   * Get database connection
   * @returns {mongoose.Connection}
   */
  getConnection() {
    return this.connection;
  }
}

// Export singleton instance
module.exports = new Database();
