// controllers/users.js
// это файл контроллеров

const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');
const IncorrectData = require('../errors/incorrect-data');

const { NODE_ENV, JWT_SECRET } = process.env;

/*
  # возвращает информацию о пользователях. Тестирование
  GET /users/
*/
const getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

// singin
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User
    .findOneByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: false,
        })
        .send({ data: user.toJSON() });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password, about, avatar,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash, about, avatar,
    }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

/*
  # возвращает информацию о пользователе (email и имя)
  GET /users/me
*/
const getUserPrifile = (req, res, next) => {
  User
    .findById(req.user._id)
    .then((user) => {
      if (user) res.status(200).send(user);
      else {
        throw (new NotFoundError('Запрашиваемый пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectData('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

/*
  # обновляет информацию о пользователе (email и имя)
  PATCH /users/me
*/
const updateUser = (req, res, next) => {
  User
    .findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (user) res.status(200).send(user);
      else {
        throw (new NotFoundError('Запрашиваемый пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new IncorrectData('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

const signOut = (req, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Выход' });
};

const secured = (req, res, next) => {
  if (!req.user) {
    next(new UnauthorizedError());
    return;
  }

  User
    .findById(req.user._id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.status(200).send({ greeting: `Hello, ${user.name}! You are in secured zone` });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  login,
  signOut,
  secured,
  getUserPrifile,
};
