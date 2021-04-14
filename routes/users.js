const router = require('express').Router();
const { patchUserValidator } = require('../middlewares/validators/userValidator');

const { getUserInfo, patchUser } = require('../controllers/users');

router.get('/users/me', getUserInfo);

router.patch('/users/me', patchUserValidator, patchUser);

module.exports = router;
