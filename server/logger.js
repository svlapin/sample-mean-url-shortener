'use strict';

const winston = require('winston');
const moment = require('moment');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        return moment().format();
      }
    })
    // new (winston.transports.File)({filename: 'somefile.log'})
  ]
});

module.exports = logger;
