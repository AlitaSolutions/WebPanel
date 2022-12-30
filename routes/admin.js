const express = require('express');
const router = express.Router();
const platformController = require('../controllers/admin/platform.controller');
const schemaController = require('../controllers/admin/schema.controller');
router.use('/platform', platformController);
router.use('/schema', schemaController);

module.exports = router;
