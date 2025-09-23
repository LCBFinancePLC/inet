const mongoose = require('mongoose');

// Define the schema
const logSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Manager', 'User'] // Add any other roles you need
  },

  loggedDate: {
    type: Date,
    default: Date.now
  }
  // Add any other fields you need
});

// Export the model
module.exports = mongoose.model('userLog', logSchema);