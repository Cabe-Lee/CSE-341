if (process.env.NODE_ENV !== 'production') {
require('dotenv').config();
}
const MongoClient = require('mongodb').MongoClient;

let _db; 

const initDb = (callback) => {
  if (_db) {
    console.log('Db is already initialized!');
    return callback(null, _db);
  }
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      const dbName = process.env.MONGODB_DB || process.env.DB_NAME || 'cse341';
      _db = client.db(dbName);
      console.log(`Database connected successfully (db: ${dbName})`);
      callback(null, _db);
    })
    .catch((err) => {
      console.error('Database connection failed:', err.message);
      if (err.code === 'ECONNREFUSED') {
        console.error('Connection refused. Please check if MongoDB is running and the URI is correct.');
      }
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error('Db not initialized');
  }
  return _db;
};

module.exports = {
  initDb,
  getDb,
};