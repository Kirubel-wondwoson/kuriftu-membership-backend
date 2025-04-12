const express = require('express')
const router = express.Router()

const {
  addPoints,
  redeemPoints
} = require('../controllers/loyalty.controller')

router.post('/add-points', addPoints)
router.post('/redeem-points/:userId', redeemPoints)

module.exports = router