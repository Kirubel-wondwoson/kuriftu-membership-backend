const express = require('express')
const router = express.Router()

const {
  createUser,
  getUser,
  getAllUsers
} = require('../controllers/user.controller')


router.post('/create-user', createUser)
router.get('/get-user', getUser)
router.get('/get-all-users', getAllUsers)

module.exports = router