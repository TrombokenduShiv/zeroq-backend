const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  name: String,
  currentNumber: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Queue', queueSchema);
