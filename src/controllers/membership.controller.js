const User = require('../models/User')
const axios = require('axios')
require('dotenv').config()

const MEMBERSHIP_PRICE = 10000;

exports.purchaseMembership = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const chapaData = {
      amount: MEMBERSHIP_PRICE,
      // currency: 'ETB',
      email: user.email,
      firstName: user.fname,
      tx_ref: `membership-${user._id}-${Date.now()}`,
      callback_url: 'http://localhost:3000/api/membership/verify-membership',
      return_url: 'http://localhost:3000.com/thank-you',
      customization: {
        title: 'Kuriftu Membership',
        description: '1 Year Premium Membership'
      }
    };

    const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', chapaData, {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`
      }
    });

    if (response.data.status === 'success') {
      return res.json({ checkout_url: response.data.data.checkout_url });
    } else {
      return res.status(400).json({ message: 'Failed to initiate payment' });
    }
  } catch (err) {
    console.error('Chapa payment init error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.verifyMembership = async (req, res) => {
  const { tx_ref } = req.query;

  try {
    const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`
      }
    });

    const data = response.data.data;

    if (data.status === 'success') {
      const userId = tx_ref.split('-')[1];
      const user = await User.findById(userId);

      if (!user) return res.status(404).json({ message: 'User not found' });

      const now = new Date();
      const expiry = new Date();
      expiry.setFullYear(now.getFullYear() + 1);

      user.loyalty.membership = {
        isActive: true,
        startDate: now,
        expiryDate: expiry,
        amountPaid: MEMBERSHIP_PRICE
      };

      await user.save();

      return res.json({ message: 'Membership activated successfully' });
    } else {
      return res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (err) {
    console.error('Error verifying payment:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
