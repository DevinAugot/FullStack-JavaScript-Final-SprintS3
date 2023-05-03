const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:VXu2lA3r8khrQwui@s3-fsjs.jehnaae.mongodb.net/?retryWrites=true&w=majority";
const pool = new MongoClient(uri);

module.exports = pool;