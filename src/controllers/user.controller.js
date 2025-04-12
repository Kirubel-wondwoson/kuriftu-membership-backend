const User = require('../models/User')

exports.createUser = async (req, res) => {
  try {
    const {name, email, phone} = req.body;
    const user = await User.findOne({email: email})
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await User.create({
      name,
      email,
      phone,
    })
    res.status(201).json({message: 'User created successfully', User: newUser})
  } catch (error) {
    console.log('Error creating user', error)
    res.status(500).json({message: 'Internal server error'})
  }
}

exports.getUser = async (req, res) => {
  try {
    const {email} = req.body
    const user = await User.findOne({email: email})

    res.status(200).json({user: user})
  } catch (error) {
    console.log('Error getting user', error)
    res.status(500).json({message: 'Internal server error'})
  }
}
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()

    res.status(200).json({users: users})
  } catch (error) {
    console.log('Error getting user', error)
    res.status(500).json({message: 'Internal server error'})
  }
}