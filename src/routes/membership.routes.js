const express = require('express')
const router = express.Router()

const {
  purchaseMembership,
  verifyMembership
} = require('../controllers/membership.controller')

router.post('/purchase-membership', purchaseMembership)
router.post('/verify-membership', verifyMembership)

module.exports = router