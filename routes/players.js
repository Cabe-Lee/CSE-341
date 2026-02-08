const express = require('express');
const router = express.Router();
const controller = require('../controllers/players');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.createPlayer);
router.put('/:id', controller.updatePlayer);
router.delete('/:id', controller.deletePlayer);

module.exports = router;
