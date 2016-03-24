'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const models = require('./models');
const logger = require('./logger');

app.use('/api', bodyParser.json());

// set up routes
require('./controllers')(app);

// TODO: serve static with nginx instead
app.use(express.static('./front'));
app.use(express.static('./bower_components'));

app.get('*', (req, res) => {
  let url = req.url.replace(/[^a-z0-9]/g, '');

  models.Url.findOne({
    short: url
  })
  .exec((err, found) => {
    if (err) {
      return res.status(500).send();
    }
    if (!found) {
      return res.status(404).send('URL not found');
    }

    if (found) {
      res.redirect(found.original);
    }

    found.update({$inc: {count: 1}})
      .exec((err) => {
        if (err) logger.error(`Failed to update ${found.id}\n`, err.stack);
      });
  });
});

module.exports = app;
