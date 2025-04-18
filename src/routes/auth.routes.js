const express = require('express')
const router = express.Router()

const {
  SignUp,
  LogIn
} = require('../controllers/auth.controller')

router.post('/signup', SignUp)
router.post('/login', LogIn)

module.exports = router