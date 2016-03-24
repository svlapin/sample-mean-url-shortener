'use strict';

const models = require('../models');
const logger = require('../logger');

const crypto = require('crypto');
const request = require('request');
const async = require('async');

const generateToken = () => {
  return crypto.randomBytes(4).toString('hex');
};

const validateUrl = (url, cb) => {
  request(url, (error, response) => {
    if (!error && response.statusCode === 200) {
      return cb(null);
    }
    return cb(new Error('URL validation failed'));
  });
};

module.exports = (app) => {
  app.get('/api/check-if-taken', (req, res) => {
    const urlToCheck = req.query.url;

    if (!urlToCheck) {
      return res.status(400).json({error: 'URL not provided'});
    }
    models.Url.findOne({
      short: urlToCheck
    })
    .exec((err, found) => {
      if (err) {
        res.status(500).json({error: 'Failed to check'});
        logger.log('error', `Failed to check url: ${urlToCheck}:\n${err.stack}`);
        return;
      }

      res.json({
        result: found ? 'ALREADY_EXISTS' : 'NOT_EXISTS'
      });
    });
  });

  app.post('/api/generate', (req, res) => {

    const instance = new models.Url({
      original: req.body.originalUrl,
      short: req.body.desiredUrl
    });

    validateUrl(instance.original, (err) => {
      if (err) {
        return res.status(400).send({error: err.message});
      }

      let saved = false;

      if (!instance.short) {
        instance.short = generateToken();
      }

      async.doUntil(

        (cb) => {
          instance.save((err) => {
            if (err && err.code !== 11000) {
              return cb(err);
            }

            if (err && err.code == 11000) {
              // take another try
              return cb(null);
            }

            saved = true;
            cb(null);
          });
        },

        () => {
          if (!saved) {
            instance.short = generateToken();
            return false;
          }
          return true;
        },

        (err) => {
          if (err) {
            logger.error(`Error while  generating short url:\n${err.stack}`);
            return res.status(500).json({error: 'Something went wrong'});
          }

          res.json({url: instance.short});
        }
      );

    });
  });
};
