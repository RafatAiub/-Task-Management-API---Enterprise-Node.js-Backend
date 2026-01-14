const mongoose = require('mongoose');
const { TASK_STATUS, TASK_PRIORITY } = require('../config/constants');

/**
 * Task Schema
 * Defines the structure and behavior of Task documents
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.PENDING,
    },
    priority: {
      type: String,
      enum: Object.values(TASK_PRIORITY),
      default: TASK_PRIORITY.MEDIUM,
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          // Due date should be in the future for new tasks
          if (this.isNew) {
            return value > new Date();
          }
          return true;
        },
        message: 'Due date must be in the future',
      },
    },
    completedAt: {
      type: Date,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
      index: true,
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    isDeleted: {
      type: Boolean,
      default: false,
      select: false, // Soft delete flag
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.isDeleted;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Compound indexes for better query performance
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ createdAt: -1 });

/**
 * Pre-save middleware to set completedAt when status changes to completed
 */
taskSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === TASK_STATUS.COMPLETED) {
    this.completedAt = new Date();
  }
  
  // Clear completedAt if status changes from completed to something else
  if (this.isModified('status') && this.status !== TASK_STATUS.COMPLETED) {
    this.completedAt = null;
  }
  
  next();
});

/**
 * Virtual for checking if task is overdue
 */
taskSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate || this.status === TASK_STATUS.COMPLETED) {
    return false;
  }
  return new Date() > this.dueDate;
});

/**
 * Virtual for days until due
 */
taskSchema.virtual('daysUntilDue').get(function () {
  if (!this.dueDate) {
    return null;
  }
  const now = new Date();
  const diffTime = this.dueDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

/**
 * Static method to find tasks by user
 * @param {string} userId
 * @returns {Promise<Task[]>}
 */
taskSchema.statics.findByUser = function (userId) {
  return this.find({ user: userId, isDeleted: false });
};

/**
 * Static method to find overdue tasks
 * @param {string} userId
 * @returns {Promise<Task[]>}
 */
taskSchema.statics.findOverdueTasks = function (userId) {
  return this.find({
    user: userId,
    isDeleted: false,
    status: { $ne: TASK_STATUS.COMPLETED },
    dueDate: { $lt: new Date() },
  });
};

/**
 * Static method to get task statistics for a user
 * @param {string} userId
 * @returns {Promise<Object>}
 */
taskSchema.statics.getStatistics = async function (userId) {
  const stats = await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  return stats.reduce((acc, stat) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {});
};

/**
 * Instance method for soft delete
 */
taskSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  await this.save();
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
