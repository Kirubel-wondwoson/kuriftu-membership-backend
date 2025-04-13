const express = require('express')
const router = express.Router()

const {
  createUser,
  getUser,
  getAllUsers,
  getUserByPhone
} = require('../controllers/user.controller')


router.post('/create-user', createUser)
router.get('/get-user/:userId', getUser)
router.get('/get-all-users', getAllUsers)
router.get('/get-user-by-phone', getUserByPhone)

module.exports = router