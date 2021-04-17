const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const mongoose = require('mongoose');

const postMovieValidator = celebrate({
  body: {
    country: Joi.string().required().messages({
      'any.required': 'country Обязательное поле',
    }),
    director: Joi.string().required().messages({
      'any.required': 'director Обязательное поле',
    }),
    duration: Joi.number().required().messages({
      'any.required': 'duration Обязательное поле',
    }),
    year: Joi.number().required().messages({
      'any.required': 'year Обязательное поле',
    }),
    description: Joi.string().required().messages({
      'any.required': 'description Обязательное поле',
    }),
    image: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Невалидная ссылка');
    }).message({
      'any.required': 'image Обязательное поле',
    }),
    trailer: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Невалидная ссылка');
    }).message({
      'any.required': 'trailer Обязательное поле',
    }),
    movieId: Joi.number().required().messages({
      'any.required': 'movieId Обязательное поле',
    }),
    thumbnail: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Невалидная ссылка');
    }).message({
      'any.required': 'thumbnail Обязательное поле',
    }),
    nameRU: Joi.string().required().messages({
      'any.required': 'nameRU Обязательное поле',
    }),
    nameEN: Joi.string().required().messages({
      'any.required': 'nameEN Обязательное поле',
    }),
  },
});

const movieIdValidator = celebrate({
  params: {
    movieId: Joi.string().custom((value, helper) => {
      if (mongoose.Types.ObjectId.isValid(value)) {
        return value;
      }
      return helper.message('Такого фильма нет');
    }),
  },
});

module.exports = {
  postMovieValidator,
  movieIdValidator,
};
