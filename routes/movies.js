const router = require('express').Router();
const { postMovieValidator, movieIdValidator } = require('../middlewares/validators/moviesValidator');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', postMovieValidator, createMovie);

router.delete('/movies/:movieId', movieIdValidator, deleteMovie);

module.exports = router;
