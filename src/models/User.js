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
    tier: { type: String, enum: ['None', 'Golden', 'Platinum', 'Diamond'], default: 'None' },
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: false },
  }
});

const UserSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  phone: String,
  password: String,
  referralCode: {
    type: String,
    unique: true,
    default: () => Math.random().toString(36).substr(2, 8).toUpperCase()
  },
  referredBy: {
    type: String // Stores referralCode of the referrer
  },
  loyalty: LoyaltySchema
});

const User = mongoose.model('User', UserSchema);

module.exports = User
