const { getDb }= require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
  const db = await getDb();
  const result = await db.collection('npcs').find().toArray();
  console.log(result);
  res.status(200).json(result);
};

const getById = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const db = await getDb();
  const result = await db
    .collection('npcs')
    .findOne({ _id: userId });
  res.status(200).json(result);
};

const createNPC = async (req, res) => {
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
  console.log('Creating NPC:', contact);
    const result = await db.collection('npcs').insertOne(contact);
    res.status(201).json(result.ops ? result.ops[0] : contact);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create NPC' + err.message });
  }
};

const updateNPC = async (req, res) => {
  try {
    const npcId = new ObjectId(req.params.id);
    const db = await getDb();
    const updatedNPC = {
        name: req.body.name,
        level: req.body.level,
        strength: req.body.strength,
        dexterity: req.body.dexterity,
        constitution: req.body.constitution,
        intelligence: req.body.intelligence,
        wisdom: req.body.wisdom,
        charisma: req.body.charisma,
    };
    const result = await db.collection('npcs').updateOne(
      { _id: npcId },
      { $set: updatedNPC }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'NPC not found' });
    }
    res.status(200).json({ message: 'NPC updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update NPC' + err.message });
  }
};

const deleteNPC = async (req, res) => {
    try {
        const npcId = new ObjectId(req.params.id);
        const db = await getDb();
        const result = await db.collection('npcs').deleteOne({ _id: npcId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'NPC not found' });
        }
        res.status(200).json({ message: 'NPC deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete NPC' + err.message });
    }
};

module.exports = { getAll, createNPC, getById, updateNPC, deleteNPC };