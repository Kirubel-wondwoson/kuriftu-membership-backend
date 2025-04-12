const express = require('express')
const router = express.Router()

const {
  createUser,
  getUser
} = require('../controllers/user.controller')


router.post('/create-user', createUser)
router.get('/get-user', getUser)

module.exports = router