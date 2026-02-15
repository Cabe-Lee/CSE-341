const { getDb } = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const validator = require('../helpers/validate');

const npcValidationRules = {
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
    const db = await getDb();
    const result = await db.collection('npcs').find().toArray();
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NPCs: ' + err.message });
  }
};

const getById = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid NPC id to find an NPC.');
    }
    const userId = new ObjectId(req.params.id);
    const db = await getDb();
    const result = await db
      .collection('npcs')
      .findOne({ _id: userId });
    
    if (!result) {
      return res.status(404).json('NPC not found');
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NPC: ' + err.message });
  }
};

const createNPC = async (req, res) => {
  try {
    validator(req.body, npcValidationRules, {}, (err, status) => {
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: err
        });
      }

      try {
        const db = getDb();
        const npc = {
          name: req.body.name,
          level: req.body.level || 1,
          strength: req.body.strength || 0,
          dexterity: req.body.dexterity || 0,
          constitution: req.body.constitution || 0,
          intelligence: req.body.intelligence || 0,
          wisdom: req.body.wisdom || 0,
          charisma: req.body.charisma || 0
        };
        console.log('Creating NPC:', npc);
        
        db.collection('npcs').insertOne(npc)
          .then(result => {
            res.status(201).json(result.ops ? result.ops[0] : npc);
          })
          .catch(insertErr => {
            res.status(500).json({ error: 'Failed to create NPC: ' + insertErr.message });
          });
      } catch (dbErr) {
        res.status(500).json({ error: 'Database connection failed: ' + dbErr.message });
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create NPC: ' + err.message });
  }
};

const updateNPC = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid NPC id to update an NPC.');
    }

    validator(req.body, npcValidationRules, {}, (err, status) => {
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
        const npc = {
          name: req.body.name,
          level: req.body.level || 1,
          strength: req.body.strength || 0,
          dexterity: req.body.dexterity || 0,
          constitution: req.body.constitution || 0,
          intelligence: req.body.intelligence || 0,
          wisdom: req.body.wisdom || 0,
          charisma: req.body.charisma || 0
        };
        console.log('Updating NPC:', userId, npc);
        
        const result = db.collection('npcs')
          .updateOne({ _id: userId }, { $set: npc });
        
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'NPC not found' });
        }
        res.status(204).send();
      } catch (dbErr) {
        res.status(500).json({ error: 'Failed to update NPC: ' + dbErr.message });
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update NPC: ' + err.message });
  }
};

const deleteNPC = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid NPC id to delete an NPC.');
    }

    const userId = new ObjectId(req.params.id);
    const db = await getDb();
    
    const result = await db.collection('npcs').deleteOne({ _id: userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'NPC not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete NPC: ' + err.message });
  }
};

module.exports = { getAll, createNPC, getById, updateNPC, deleteNPC };
