const router = require('express').Router();

const {
  celebrate,
  Joi,
} = require('celebrate');

const {
  getUsers,
  updateUser,
  getUserPrifile,
} = require('../controllers/users');

// Just for test
router.get('/', getUsers);

router.get('/me', getUserPrifile);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(15),
    about: Joi.string().required().max(30),
  }),
}), updateUser);

module.exports = router;
