const express = require('express')
const router = express.Router()

const {
  InitializePayment,
  VerifyPayment
} = require('../controllers/payment.controller')

router.post('/initialize-payment', InitializePayment)
router.post('/verify-payment', VerifyPayment)

module.exports = router