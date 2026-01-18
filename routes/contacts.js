const express = require('express');
const router = express.Router();

const contactsController = 
require('../controllers/contactsCon');

router.get('/', contactsController.getAllContacts);

router.get('/:id', contactsController.getContactById);

module.exports = router;