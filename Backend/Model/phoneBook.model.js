const e = require('express');
const mongoose = require('mongoose');

const phonebookEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },

branch: {
    type: String,
    required: true,
   default: 'Head Office',
   enum: ['Agunukolapelessa', 'Akuressa', 'Deiyandara', 'Embilipitiya', 'Galle', 'Gampaha', 'Head Office', 'Karandeniya', 'Karapitiya', 'Kegalle', 'Kohuwala',
    'Kuliyapitiya', 'Matara', 'Maharagama', 'Negombo', 'Pelawaththa', 'Rathgama', 'Tangalle', 'Tissamaharama', 'Walasmulla'],
  },

  
  department: {
    type: String,
    required: false,
  },
  extensionCode: {
    type: String,
    required: false,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookEntrySchema);

module.exports = PhonebookEntry;
