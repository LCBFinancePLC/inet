// pdfModel.js
const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  pdfName: {
    type: String,
    required: true
  },
  pdfDescription: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },

pdfStatus: {
    type: Boolean,
    default: true
  },

  date: {
    type: Date,
    default: function() {
      return new Date(); 
    }
  },

approval: {
    type: Boolean,
    default: false
  },

notificationEmail: {
  type: String,
  required: false
}


});

const Pdf = mongoose.model('Pdf', pdfSchema);

module.exports = Pdf;