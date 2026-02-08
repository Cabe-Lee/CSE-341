const express = require('express');
const router = express.Router();
const controller = require('../controllers/contactsCon');

// const { makeContactsController } = require('../controllers/contactsCon');
// const { makeContactsRepo } = require('../repos/contactsRepo');
// const Contact = require('../models/contacts');

// const repo = makeContactsRepo(Contact);
// const controller = makeContactsController(repo);

router.get('/', controller.getAll);

router.get('/:id', controller.getSingle);

router.post('/', controller.createContact);

// router.put('/:id', controller.updateContact);

// router.delete('/:id', controller.deleteContact);

module.exports = router;
