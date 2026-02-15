const { getDb } = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const validator = require('../helpers/validate');

const playerValidationRules = {
  name: 'required|string|min:1|max:100',
  level: 'integer|min:0',
  strength: 'integer|min:0',
  dexterity: 'integer|min:0',
  constitution: 'integer|min:0',
  intelligence: 'integer|min:0',
  wisdom: 'integer|min:0',
  charisma: 'integer|min:0'
};

const getAll = async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db.collection('players').find().toArray();
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    if (err.message === 'Db not initialized') {
      res.status(503).json({ error: 'Database not available' });
    } else {
      res.status(500).json({ error: 'Failed to retrieve players: ' + err.message });
    }
  }
};

const getById = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid player id to find a player.');
    }
    const userId = new ObjectId(req.params.id);
    const db = getDb();
    const result = await db
      .collection('players')
      .findOne({ _id: userId });
    
    if (!result) {
      return res.status(404).json('Player not found');
    }
    res.status(200).json(result);
  } catch (err) {
    if (err.message === 'Db not initialized') {
      res.status(503).json({ error: 'Database not available' });
    } else {
      res.status(500).json({ error: 'Failed to retrieve player: ' + err.message });
    }
  }
};

const createPlayer = async (req, res) => {
  try {
    validator(req.body, playerValidationRules, {}, (err, status) => {
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: err
        });
      }

      try {
        const db = getDb();
        const player = {
          name: req.body.name,
          level: req.body.level || 1,
          strength: req.body.strength || 0,
          dexterity: req.body.dexterity || 0,
          constitution: req.body.constitution || 0,
          intelligence: req.body.intelligence || 0,
          wisdom: req.body.wisdom || 0,
          charisma: req.body.charisma || 0
        };
        console.log('Creating player:', player);
        
        db.collection('players').insertOne(player)
          .then(result => {
            res.status(201).json(result.ops ? result.ops[0] : player);
          })
          .catch(insertErr => {
            res.status(500).json({ error: 'Failed to create player: ' + insertErr.message });
          });
      } catch (dbErr) {
        if (dbErr.message === 'Db not initialized') {
          res.status(503).json({ error: 'Database not available' });
        } else {
          res.status(500).json({ error: 'Database connection failed: ' + dbErr.message });
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create player: ' + err.message });
  }
};

const updatePlayer = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid player id to update a player.');
    }

    validator(req.body, playerValidationRules, {}, (err, status) => {
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: err
        });
      }

      try {
        const db = getDb();
        const userId = new ObjectId(req.params.id);
        const player = {
          name: req.body.name,
          level: req.body.level,
          strength: req.body.strength,
          dexterity: req.body.dexterity,
          constitution: req.body.constitution,
          intelligence: req.body.intelligence,
          wisdom: req.body.wisdom,
          charisma: req.body.charisma
        };
        console.log('Updating player:', userId, player);
        
        db.collection('players')
          .updateOne({ _id: userId }, { $set: player })
          .then(result => {
            if (result.matchedCount === 0) {
              return res.status(404).json({ error: 'Player not found' });
            }
            res.status(204).send();
          })
          .catch(updateErr => {
            res.status(500).json({ error: 'Failed to update player: ' + updateErr.message });
          });
      } catch (dbErr) {
        if (dbErr.message === 'Db not initialized') {
          res.status(503).json({ error: 'Database not available' });
        } else {
          res.status(500).json({ error: 'Database connection failed: ' + dbErr.message });
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update player: ' + err.message });
  }
};

const deletePlayer = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid player id to delete a player.');
    }

    const userId = new ObjectId(req.params.id);
    const db = getDb();
    
    const result = await db.collection('players').deleteOne({ _id: userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.status(204).send();
  } catch (err) {
    if (err.message === 'Db not initialized') {
      res.status(503).json({ error: 'Database not available' });
    } else {
      res.status(500).json({ error: 'Failed to delete player: ' + err.message });
    }
  }
};

module.exports = { getAll, createPlayer, getById, updatePlayer, deletePlayer };
