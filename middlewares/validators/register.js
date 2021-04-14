const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const register = celebrate({
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
    password: Joi.string().required().min(8).messages({
      'sting.min': 'Минимум 8 символов',
      'any.required': 'Обязательное поле',
    }),
  },
});

module.exports = register;
