const Payment = require('../models/Payment')
const User = require('../models/User')
const axios = require('axios')
require('dotenv').config()


// exports.InitializePayment = async (req, res) => {
//   try {
//     const {
//       userId,
//       amount
//     } = req.body;
//     const user = await User.findOne({userId: userId})

//     const transactionReference = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

//     const newPayment = new Payment({
//       user: userId,
//       amount: amount,
//       transactionReference
//     })
//     await newPayment.save();

//     // send request to chapa
//     const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
//       amount: 10000,
//       email: user.email,
//       firstName: user.fname,
//       lastName: user.lname,
//       phone: user.phone,
//       tx_ref: transactionReference,
//       callback_url: `http://localhost:3000/api/payment/verify-payment/${transactionReference}`,
//       return_url: 'http://localhost:3000/payment-success'
//     }, {
//       headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` }
//     })

//     console.log(response.data)
//     res.json(response.data)
//   } catch (error) {
//     console.error('Error Initializing payment:', error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message })
//   }
// }

// exports.VerifyPayment = async (req, res) => {
//   try {
//     const {transactionReference} = req.params;

//     const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${transactionReference}`, {
//       headers: {Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`}
//     })

//     const paymentStatus = response.data.status;
//     if(paymentStatus === 'success'){
//       await Payment.findOneAndUpdate({transactionReference}, {status: 'Successful'});
//       console.log('Payment successfuly from verify payment')
//       res.json({message: 'Payment verfied successfully'})
//     } else{
//       await Payment.findOneAndUpdate({transactionReference}, {status: 'Failed'})
//       console.log('Payment failed from verify payment')

//       res.status(400).json({message: 'Payment verification failed'})
//     }
//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message })
//   }
// }

exports.purchaseMembershipWithCard = async (req, res) => {

  const userId = req.params.userId;
  const {tier, cardNumber, expiry, cvc } = req.body;

  // Only accept specific test cards for demo purposes
  const validTestCard = '4242424242424242';
  const validExpiry = '12/30'; // example
  const validCvc = '123';

  if (!['Golden', 'Platinum', 'Diamond'].includes(tier)) {
    return res.status(400).json({ message: 'Invalid tier selected' });
  }

  if (cardNumber !== validTestCard || expiry !== validExpiry || cvc !== validCvc) {
    return res.status(400).json({ message: 'Invalid demo card details' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);

    user.membership = {
      tier,
      startDate: today,
      endDate: nextYear,
      isActive: true
    };

    await user.save();

    res.status(200).json({
      message: `Successfully activated ${tier} membership.`,
      membership: user.membership
    });
  } catch (err) {
    console.error('Error processing membership payment:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
