const mongoose = require('mongoose');
const { stringify } = require('querystring');

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
  ],

  membership: {
    isActive: { type: Boolean, default: false },
    startDate: { type: Date },
    expiryDate: { type: Date },
    amountPaid: { type: Number },
  }
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  gender: {
    type: String,
    enum: ['Male', 'Female']
  },
  loyalty: LoyaltySchema
});

const User = mongoose.model('User', UserSchema);

module.exports = User
