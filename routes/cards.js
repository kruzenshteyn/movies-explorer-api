/*
  GET /cards — возвращает все карточки
  POST /cards — создаёт карточку
  DELETE /cards/:cardId — удаляет карточку по идентификатору
  PUT /cards/:cardId/likes — поставить лайк карточке
  DELETE /cards/:cardId/likes — убрать лайк с карточки
*/

const router = require('express').Router();

const validator = require('validator');

const {
  celebrate,
  Joi,
} = require('celebrate');

const validateURL = (value) => {
  if (!validator.isURL(value, {
    require_protocol: true,
  })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(validateURL).required(),
  }),
}), createCard);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), deleteCard);

router.put('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), putLike);

router.delete('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), deleteLike);

module.exports = router;
