const router = require('express').Router();

const validator = require('validator');
const {
  celebrate,
  Joi,
} = require('celebrate');

const cors = require('cors');

const usersRoutes = require('./users');

const moviesRoutes = require('./movies');

const NotFoundError = require('../errors/not-found-error');

const {
  login, createUser, signOut, secured,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

const validateURL = (value) => {
  if (!validator.isURL(value, {
    require_protocol: true,
  })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

router.use(cors({
  origin: ['http://localhost:3000', 'http://alexbaev.nomoredomains.xyz', 'https://alexbaev.nomoredomains.xyz'], // домен фронтенда
  credentials: true, // для того, чтобы CORS поддерживал кроссдоменные куки
}));

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.use(auth);

router.get('/signout', signOut);

router.get('/secured', secured);

router.use('/users', usersRoutes);

router.use('/movies', moviesRoutes);

router.use((req, res, next) => {
  next(new NotFoundError());
});

module.exports = router;
