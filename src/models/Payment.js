const mongoose = require('mongoose')

const PaymentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'ETB'
  },
  status: {
    type: String,
    enum: ['Pending', 'Successful', 'Failed'],
    default: 'Pending'
  },
  transactionReference: {
    type: String,
    unique: true
  }
}, { timestamps: true })

const Payment = mongoose.model('Payment', PaymentSchema)

module.exports = Payment