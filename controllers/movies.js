const Movie = require('../models/movies');

const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const IncorrectData = require('../errors/incorrect-data');

/*
  # возвращает все сохранённые текущим  пользователем фильмы
*/
const getMovies = (req, res, next) => {
  Movie
    .find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};

/*
  # создаёт фильм с переданными в теле
  # country, director, duration, year, description, image,
  trailerLink, nameRU, nameEN и thumbnail, movieId
 */
const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  return Movie
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new IncorrectData({ message: 'Переданы некорректные данные при создании фильма' }));
      } else {
        next(err);
      }
    });
};

/*
  # удаляет сохранённый фильм по id
*/
const deleteMovie = (req, res, next) => {
  Movie
    .findOne({ _id: req.params.id })
    .orFail(() => {
      throw (new NotFoundError('Фильм с указанным _id не найдена'));
    })
    .then((item) => {
      if (item.owner.equals(req.user._id)) {
        Movie.deleteOne({ _id: req.params.id })
          .then((deletedItem) => {
            res.send({ deletedCard: deletedItem });
          });
      } else {
        throw (new ForbiddenError('Нет доступа для удаления данного фильма'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new IncorrectData({ message: 'Переданы некорректные данные при удалении фильма' }));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
