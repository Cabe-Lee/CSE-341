const { getDb }= require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
  const db = await getDb();
  const result = await db.collection('contacts').find().toArray();
  console.log(result);
  res.status(200).json(result);
};

const getSingle = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const db = await getDb();
  const result = await db
    .collection('contacts')
    .findOne({ _id: userId });
  res.status(200).json(result);
};




const createContact = async (req, res) => {
  try {
    const db = await getDb();
    const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  console.log('Creating contact:', contact);
    const result = await db.collection('contacts').insertOne(contact);
    res.status(201).json(result.ops ? result.ops[0] : contact);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create contacts' + err.message });
  }
};


module.exports = { getAll, getSingle, createContact };

// function makeContactsController(repo) {
//     getAll: async (req, res) => {
//       try {
//         const contacts = await repo.list();
//         res.setHeader('Content-Type', 'application/json');
//         res.status(200).json(contacts);
//       } catch (error) {
//         console.error('Error fetching contacts:', error);
//         res.status(500).json({ error: 'Failed to fetch contacts' });
//       }
//     },

//     getSingle: async (req, res) => {
//       try {
//         const contact = await repo.getById(req.params.id);
//         if (!contact) {
//           return res.status(404).json({ error: 'Contact not found' });
//         }
//         res.setHeader('Content-Type', 'application/json');
//         res.status(200).json(contact);
//       } catch (error) {
//         console.error('Error fetching contact:', error);
//         res.status(500).json({ error: 'Failed to fetch contact' });
//       }
//     },

//     createContact: async (req, res) => {
//       try {
//         const contact = await repo.create(req.body);
//         res.status(201).json(contact);
//       } catch (error) {
//         console.error('Error creating contact:', error);
//         res.status(500).json({ error: 'Failed to create contact' });
//       }
//     },

//     updateContact: async (req, res) => {
//       try {
//         const contact = await repo.update(req.params.id, req.body);
//         if (!contact) {
//           return res.status(404).json({ error: 'Contact not found' });
//         }
//         res.status(204).send();
//       } catch (error) {
//         console.error('Error updating contact:', error);
//         res.status(500).json({ error: 'Failed to update contact' });
//       }
//     },

//     deleteContact: async (req, res) => {
//       try {
//         const result = await repo.remove(req.params.id);
//         if (!result) {
//           return res.status(404).json({ error: 'Contact not found' });
//         }
//         res.status(204).send();
//       } catch (error) {
//         console.error('Error deleting contact:', error);
//         res.status(500).json({ error: 'Failed to delete contact' });
//       }
//     },
//   };
// }

// module.exports = { makeContactsController };
