'use strict';

const fs = require('fs');

const server = require('./server');
const logger = require('./server/logger');
const models = require('./server/models');

// load config
if (process.env.NODE_ENV !== 'production' &&
  fs.existsSync('.env')) {
  const env = require('node-env-file');
  console.log('Reading local .env file');
  env('.env');
}

const startServer = () => {
  const port = process.env.PORT || 8080;
  server.listen(port, () => {
    logger.info(`Server is listening on ${port}`);
  });
};

models.connect(process.env.MONGO_URI, (err) => {
  if (err) {
    logger.log('error', `Failed to connect to MongoDB:\n${err.stack}`);
    process.exit(1);
  }

  logger.info(`Successfully connected to ${process.env.MONGO_URI}`);

  startServer();
});
