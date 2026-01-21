const express = require('express');

const professionalController = require('../controllers/professionalCon');

const router = express.Router();

router.get('/', professionalController.getData);

module.exports = router;