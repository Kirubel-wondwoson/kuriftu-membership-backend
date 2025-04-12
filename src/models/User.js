const mongoose = require('mongoose');

const LoyaltySchema = new mongoose.Schema({
  points: { type: Number, default: 0 },
  tier: { 
    type: String, 
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze' 
  },
  tierAchievedDate: { type: Date, default: Date.now },
  history: [
    {
      type: { type: String }, // booking, referral, redeem
      points: Number,
      date: Date,
      reward: String
    }
  ]
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  loyalty: LoyaltySchema
});

const User = mongoose.model('User', UserSchema);

module.exports = User
