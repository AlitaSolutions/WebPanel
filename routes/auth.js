const router = require('express').Router();
const authenticationController = require('../controllers/auth/user.controller');
router.use('/auth', authenticationController);
module.exports = router;