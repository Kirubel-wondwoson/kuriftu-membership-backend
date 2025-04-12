const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  name: String,
  description: String,
  cost: Number, // in points
  available: { type: Boolean, default: true },
  quantity: Number, // (optional)
  category: {
    type: String,
    enum: ['spa', 'stay', 'food']
  }, 
});

const Reward = mongoose.model('Reward', RewardSchema);

module.exports = Reward;
