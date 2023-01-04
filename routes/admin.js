const express = require('express');
const router = express.Router();
const platformController = require('../controllers/admin/platform.controller');
const schemaController = require('../controllers/admin/schema.controller');
const settingsController = require('../controllers/admin/settings.controller');
const serviceController = require('../controllers/admin/service.controller');
router.use('/platform', platformController);
router.use('/schema', schemaController);
router.use('/setting', settingsController);
router.use('/service', serviceController);

module.exports = router;
