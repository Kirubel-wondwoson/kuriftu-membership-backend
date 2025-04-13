const express = require('express')
const router = express.Router()

const {
  addPoints,
  redeemPoints,
  getPoint,
  updatePoint
} = require('../controllers/loyalty.controller')

router.post('/add-points', addPoints)
router.post('/redeem-points/:userId', redeemPoints)
router.get('/get-points/:userId', getPoint)
// router.get('/update-point/:userId', updatePoint)
 
module.exports = router