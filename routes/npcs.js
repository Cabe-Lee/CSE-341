const express = require('express');
const router = express.Router();
const controller = require('../controllers/npcs');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.createNPC);
router.put('/:id', controller.updateNPC);
router.delete('/:id', controller.deleteNPC);

module.exports = router;
