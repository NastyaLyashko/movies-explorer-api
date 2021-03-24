const { celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');
const validator = require('validator');

const userIdValidator = celebrate({
  params: {
    _id: Joi.string().required().custom((value, helper) => {
      if (mongoose.Types.ObjectId.isValid(value)) {
        return value;
      }
      return helper.message('Такого пользователя нет');
    }),
  },
});

const patchUserValidator = celebrate({
  body: {
    name: Joi.string().required().min(2).messages({
      'sting.min': 'Минимум 2 символа',
      'any.required': 'Обязательное поле',
    }),
    email: Joi.string().required().custom((value, helper) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helper.message('Невалидный email');
    }).message({
      'any.required': 'Обязательное поле',
    }),
  },
});

module.exports = {
  userIdValidator,
  patchUserValidator,
};
