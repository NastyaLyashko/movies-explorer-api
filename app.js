require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter, MONGO_URL } = require('./config');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());

app.use(requestLogger);

app.use(limiter);

app.use(helmet());

app.use(express.json());

app.use(routes);

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT);
