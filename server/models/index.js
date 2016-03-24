'use strict';

const mongoose = require('mongoose');

module.exports.connect = (mongoUrl, cb) => {
  if (!mongoUrl) {
    process.nextTick(() => cb(new Error('MongoDB URL not provided')));
  }

  mongoose.connect(mongoUrl, cb);
  mongoose.connection.on('error', function(e) {
    console.error('Mongoose error:', e);
  });
};

module.exports.disconnect = (cb) => {
  mongoose.disconnect(function(err) {
    if (err) return cb(new Error('Cannot disconnect mongoose'));
    console.log('Mongoose disconnected');
    if (cb) cb(null);
  });
};

const models = [
  'Url'
];

models.forEach((m) => {
  const req = require('./' + m);
  if (typeof req === 'function') {
    module.exports[m] = req;
  } else {
    Object.keys(req).forEach(k => {
      module.exports[k] = req[k];
    });
  }
});
