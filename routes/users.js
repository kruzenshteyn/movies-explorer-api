const router = require('express').Router();

const {
  celebrate,
  Joi,
} = require('celebrate');

const validator = require('validator');

const validateURL = (value) => {
  if (!validator.isURL(value, {
    require_protocol: true,
  })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getUserPrifile,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUserPrifile);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(15),
    about: Joi.string().required().max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validateURL).required(),
  }),
}), updateAvatar);

module.exports = router;
