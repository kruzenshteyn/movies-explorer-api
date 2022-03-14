const mongoose = require('mongoose');
const validator = require('validator');

// Опишем схему:
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  }, // страна создания фильма. Обязательное поле-строка.
  director: {
    type: String,
    required: true,
  }, // режиссёр фильма. Обязательное поле-строка.
  duration: {
    type: Number,
    required: true,
  }, // длительность фильма. Обязательное поле-число.
  year: {
    type: Number,
    required: true,
  }, // год выпуска фильма. Обязательное поле-строка.
  description: {
    type: String,
    required: true,
  }, // описание фильма. Обязательное поле-строка.
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
    },
  }, // ссылка на постер к фильму. Обязательное поле-строка. Запишите её URL-адресом.
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
    },
  }, // ссылка на трейлер фильма. Обязательное поле-строка. Запишите её URL-адресом.
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
    },
  }, // миниатюрное изображение постера к фильму. Обязательное. Запишите её URL-адресом.
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  }, // _id пользователя, который сохранил фильм. Обязательное поле.
  movieId: {
    type: Number,
    required: true,
  }, // id фильма, который содержится в ответе сервиса MoviesExplorer. Обязательное поле.
  nameRU: {
    type: String,
    required: true,
  }, // название фильма на русском языке. Обязательное поле-строка.
  nameEN: {
    type: String,
    required: true,
  }, // название фильма на английском языке. Обязательное поле-строка.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('movie', movieSchema);
