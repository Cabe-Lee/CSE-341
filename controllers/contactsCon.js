const { getDb } = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const validator = require('../helpers/validate');

const contactValidationRules = {
  firstName: 'required|string|min:1|max:50',
  lastName: 'required|string|min:1|max:50',
  email: 'required|email',
  favoriteColor: 'string|max:30',
  birthday: 'string|min:8|max:10'
};

const getAll = async (req, res, next) => {
  try {
    const db = await getDb();
    const result = await db.collection('contacts').find().toArray();
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve contacts: ' + err.message });
  }
};


const getSingle = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid contact id to find a contact.');
    }
    const userId = new ObjectId(req.params.id);
    const db = await getDb();
    const result = await db
      .collection('contacts')
      .findOne({ _id: userId });
    
    if (!result) {
      return res.status(404).json('Contact not found');
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve contact: ' + err.message });
  }
};


const createContact = async (req, res) => {
  try {
    validator(req.body, contactValidationRules, {}, (err, status) => {
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: err
        });
      }

      getDb().then(db => {
        const contact = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          favoriteColor: req.body.favoriteColor || '',
          birthday: req.body.birthday || ''
        };
        console.log('Creating contact:', contact);
        
        db.collection('contacts').insertOne(contact)
          .then(result => {
            res.status(201).json(result.ops ? result.ops[0] : contact);
          })
          .catch(insertErr => {
            res.status(500).json({ error: 'Failed to create contact: ' + insertErr.message });
          });
      }).catch(dbErr => {
        res.status(500).json({ error: 'Database connection failed: ' + dbErr.message });
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create contact: ' + err.message });
  }
};


const updateContact = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid contact id to update a contact.');
    }

    validator(req.body, contactValidationRules, {}, (err, status) => {
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: err
        });
      }

      getDb().then(db => {
        const userId = new ObjectId(req.params.id);
        const contact = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          favoriteColor: req.body.favoriteColor || '',
          birthday: req.body.birthday || ''
        };
        console.log('Updating contact:', userId, contact);
        
        db.collection('contacts')
          .updateOne({ _id: userId }, { $set: contact })
          .then(result => {
            if (result.matchedCount === 0) {
              return res.status(404).json({ error: 'Contact not found' });
            }
            res.status(204).send();
          })
          .catch(updateErr => {
            res.status(500).json({ error: 'Failed to update contact: ' + updateErr.message });
          });
      }).catch(dbErr => {
        res.status(500).json({ error: 'Database connection failed: ' + dbErr.message });
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact: ' + err.message });
  }
};


const deleteContact = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid contact id to delete a contact.');
    }

    const userId = new ObjectId(req.params.id);
    const db = await getDb();
    
    const result = await db.collection('contacts').deleteOne({ _id: userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete contact: ' + err.message });
  }
};

module.exports = { getAll, getSingle, createContact, updateContact, deleteContact };