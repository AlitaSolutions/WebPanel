const express = require('express');
const router = express.Router();
const platformController = require('../controllers/admin/platform.controller');
const schemaController = require('../controllers/admin/schema.controller');
const settingsController = require('../controllers/admin/settings.controller');
router.use('/platform', platformController);
router.use('/schema', schemaController);
router.use('/setting', settingsController);

module.exports = router;
