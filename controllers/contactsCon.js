const mongodb = require('./db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
    const results = await mongodb.getDb().db().collection('contacts').find();
    results.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    });
};

const getSingle = async (req, res, next) => {
    const contactId = new ObjectId(req.params.id);
    const result = await mongodb
        .getDb()
        .db()
        .collection('contacts')
        .find({ _id: contactId });
    result.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
};

module.exports = {
    getAll,
    getSingle
};