const express = require('express')
const router = express.Router()

const {
  createRewards,
  getRewards
} = require('../controllers/reward.controller')


router.post('/create-reward', createRewards)
router.get('/get-rewards', getRewards)

module.exports = router