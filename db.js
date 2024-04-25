const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/project'; // Replace 'myDatabaseName' with your database name

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.log('MongoDB connection error:', err));

const DataSchema = new mongoose.Schema({
  content: {}
}, { timestamps: true }); // Optional: timestamps add 'createdAt' and 'updatedAt' fields

const Data = mongoose.model('Data', DataSchema);
const OperationCount = mongoose.model('OperationCount', new mongoose.Schema({
  add: { type: Number, default: 0 },
  update: { type: Number, default: 0 }
}));

module.exports = { Data, OperationCount };
