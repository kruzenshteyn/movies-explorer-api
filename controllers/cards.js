const Card = require('../models/cards');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const IncorrectData = require('../errors/incorrect-data');

/*
400 — Переданы некорректные данные при создании карточки.
500 — Ошибка по умолчанию.
*/
const getCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

/* В теле POST-запроса на создание карточки передайте JSON-объект с двумя
полями: name и link . */
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return Card
    .create({ name, link, owner: req.user })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new IncorrectData({ message: 'Переданы некорректные данные при создании карточки' }));
      } else {
        next(err);
      }
    });
};

/*
404 — Карточка с указанным _id не найдена.
*/
const deleteCard = (req, res, next) => {
  Card
    .findOne({ _id: req.params.id })
    .orFail(() => {
      throw (new NotFoundError('Карточка с указанным _id не найдена'));
    })
    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        Card.deleteOne({ _id: req.params.id })
          .then((deletedCard) => {
            res.send({ deletedCard });
          });
      } else {
        throw (new ForbiddenError('Нет доступа для удаления данной карточки'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new IncorrectData({ message: 'Переданы некорректные данные при удалении карточки' }));
      } else {
        next(err);
      }
    });
};

/*
400 — Переданы некорректные данные для постановки/снятии лайка.
500 — Ошибка по умолчанию.
*/
const putLike = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .then((card) => {
      if (card) res.status(200).send(card);
      else throw (new NotFoundError('Карточка с указанным _id не найдена'));
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError': next(new IncorrectData('Переданы некорректные данные при удалении карточки')); break;
        case 'CastError': next(new IncorrectData('Ошибка в _id пользователя')); break;
        default: next(err); break;
      }
    });
};

const deleteLike = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .then((card) => {
      if (card) res.status(200).send(card);
      else throw (new NotFoundError('Карточка с указанным _id не найдена'));
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError': next(new IncorrectData('Переданы некорректные данные при удалении карточки')); break;
        case 'CastError': next(new IncorrectData('Ошибка в _id пользователя')); break;
        default: next(err); break;
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
