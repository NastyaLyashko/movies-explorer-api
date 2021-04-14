const rateLimit = require('express-rate-limit');

const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'secret-key',

  limiter: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),

  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/moviedb',
};

module.exports = config;
