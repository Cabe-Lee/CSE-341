const { getDb }= require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
  const db = await getDb();
  const result = await db.collection('players').find().toArray();
  console.log(result);
  res.status(200).json(result);
};

const getById = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const db = await getDb();
  const result = await db
    .collection('players')
    .findOne({ _id: userId });
  res.status(200).json(result);
};

const createPlayer = async (req, res) => {
  try {
    const db = await getDb();
    const contact = {
    name: req.body.name,
    level: req.body.level,
    strength: req.body.strength,
    dexterity: req.body.dexterity,
    constitution: req.body.constitution,
    intelligence: req.body.intelligence,
    wisdom: req.body.wisdom,
    charisma: req.body.charisma,
  };
  console.log('Creating player:', contact);
    const result = await db.collection('players').insertOne(contact);
    res.status(201).json(result.ops ? result.ops[0] : contact);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create player' + err.message });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const playerId = new ObjectId(req.params.id);
    const db = await getDb();
    const updatedPlayer = {
        name: req.body.name,
        level: req.body.level,
        strength: req.body.strength,
        dexterity: req.body.dexterity,
        constitution: req.body.constitution,
        intelligence: req.body.intelligence,
        wisdom: req.body.wisdom,
        charisma: req.body.charisma,
    };
    const result = await db.collection('players').updateOne(
      { _id: playerId },
      { $set: updatedPlayer }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.status(200).json({ message: 'Player updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update player' + err.message });
  }
};

const deletePlayer = async (req, res) => {
    try {
        const playerId = new ObjectId(req.params.id);
        const db = await getDb();
        const result = await db.collection('players').deleteOne({ _id: playerId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }
        res.status(200).json({ message: 'Player deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete player' + err.message });
    }
};

module.exports = { getAll, createPlayer, getById, updatePlayer, deletePlayer };
