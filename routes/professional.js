const express = require('express');

const professionalController = require('../controllers/professionalCon');

const router = express.Router();

router.get('/', professionalController.getAll);

module.exports = router;