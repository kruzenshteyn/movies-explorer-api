require('dotenv').config();

const express = require('express');

const { PORT, NODE_ENV, DB_ADDRESS } = process.env;

const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const {
  errors,
} = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const routes = require('./routes');
const errorHandler = require('./middlewares/error-handler');

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : 'mongodb://localhost:27017/moviesdb', {
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger); // подключаем логгер запросов
app.use(routes);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(errorHandler);

app.listen(NODE_ENV === 'production' ? PORT : 3001, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${NODE_ENV === 'production' ? PORT : 3001}`);
});
