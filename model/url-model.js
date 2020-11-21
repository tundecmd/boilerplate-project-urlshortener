const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const urlSchema = {
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: String,
    required: true
  }
}

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;