'use strict';

const mongoose = require('mongoose');

const Url = new mongoose.Schema({
  original: {type: String, required: true},
  short: {type: String, required: true, unique: true},
  count: {type: Number, default: 0},
  data: {type: Date, default: Date.now, expires: '15d'}
});

module.exports.Url = mongoose.model('Url', Url);
