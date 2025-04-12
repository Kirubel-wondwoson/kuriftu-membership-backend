const Payment = require('../models/Payment')
const User = require('../models/User')
const axios = require('axios')
require('dotenv').config()


exports.InitializePayment = async (req, res) => {
  try {
    const {
      userId,
      amount
    } = req.body;
    const user = await User.findOne({userId: userId})

    const transactionReference = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newPayment = new Payment({
      user: userId,
      amount: amount,
      transactionReference
    })
    await newPayment.save();

    // send request to chapa
    const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
      amount: 10000,
      email: user.email,
      firstName: user.fname,
      lastName: user.lname,
      phone: user.phone,
      tx_ref: transactionReference,
      callback_url: `http://localhost:3000/api/payment/verify-payment/${transactionReference}`,
      return_url: 'http://localhost:3000/payment-success'
    }, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` }
    })

    console.log(response.data)
    res.json(response.data)
  } catch (error) {
    console.error('Error Initializing payment:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

exports.VerifyPayment = async (req, res) => {
  try {
    const {transactionReference} = req.params;

    const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${transactionReference}`, {
      headers: {Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`}
    })

    const paymentStatus = response.data.status;
    if(paymentStatus === 'success'){
      await Payment.findOneAndUpdate({transactionReference}, {status: 'Successful'});
      console.log('Payment successfuly from verify payment')
      res.json({message: 'Payment verfied successfully'})
    } else{
      await Payment.findOneAndUpdate({transactionReference}, {status: 'Failed'})
      console.log('Payment failed from verify payment')

      res.status(400).json({message: 'Payment verification failed'})
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}