const mongoose = require('mongoose');
const Movie = require('../models/movie');
const { NotFound, BadRequest, Forbidden } = require('../errors');

const getMovies = (req, res, next) => {
  Movie.find({})
    .orFail(() => {
      throw new NotFound('Фильм не найден');
    })
    .populate('user')
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, movieId, nameRU, nameEN, thumbnail
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
    owner,
  })
    .then((movie) => {
      if (!movie) {
        throw new BadRequest('BadRequest');
      }
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: err.message });
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Фильм не найден');
      }
      if (String(movie.owner) !== String(req.user._id)) {
        throw new Forbidden('Нельзя удалить чужой фильм');
      }
      return Movie.findByIdAndRemove(req.params.movieId)
        .orFail(() => {
          throw new NotFound('Фильм не найден');
        })
        .catch((err) => next(err));
    })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err instanceof mongoose.CastError) {
        return res.status(400).send({ message: err.message });
      }
      return next(err);
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
