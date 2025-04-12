const express = require('express')
const router = express.Router()

const {
  purchaseMembership
} = require('../controllers/membership.controller')

router.post('/purchase-membership', purchaseMembership)

module.exports = router