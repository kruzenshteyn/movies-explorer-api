require('dotenv').config();

const express = require('express');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const {
  errors,
} = require('celebrate');
const { DB_ADDRESS } = require('./config');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const routes = require('./routes');
const errorHandler = require('./middlewares/error-handler');

const app = express();

mongoose.connect(DB_ADDRESS, {
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger); // подключаем логгер запросов
app.use(routes);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
