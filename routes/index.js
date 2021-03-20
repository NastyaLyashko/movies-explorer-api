const router = require('express').Router();
const movieData = require('./movies');
const usersData = require('./users');
const { NotFound } = require('../errors');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const registerValidator = require('../middlewares/validators/register');
const loginValidator = require('../middlewares/validators/login');

router.post('/signup', registerValidator, createUser);

router.post('/signin', loginValidator, login);

router.use('/', auth, movieData);

router.use('/', auth, usersData);

router.use('*', auth, () => {
  throw new NotFound('Страница не найдена');
});

module.exports = router;
