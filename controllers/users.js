const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const User = require('../models/user');
const {
  NotFound, Unauthorized, BadRequest, Conflict,
} = require('../errors');

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Conflict('Пользователь с таким email уже зарегестрирован');
      }
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name,
          email,
          password: hash,
        }))
        .then(({
          userId,
          userName,
          usereMail,
        }) => {
          res.send({
            _id: userId,
            name: userName,
            email: usereMail,
          });
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: err.message });
      }
      return next(err);
    });
};

const patchUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true, new: true })
    .orFail(() => {
      throw new BadRequest('Переданы некорректные данные');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.CastError) {
        return res.status(400).send({ message: err.message });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: err.message });
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Пользователь не зарегистрирован');
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createUser, patchUser, login, getUserInfo,
};
