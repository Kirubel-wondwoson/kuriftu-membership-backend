const User = require('../models/User')
const bcrypt = require('bcrypt')
const {
  hashPassword,
  generateToken
} = require('../utils/auth.utils')

exports.SignUp = async (req, res) => {
  const { name, email, password, phone, gender,} = req.body
  try {

    // hash the password
    const hashedPassword = await hashPassword(password)

    const existingUser = await User.findOne({ email: email })
    if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' })  
    }


    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      authProvider: ['Local'],
      enrolledCourses: []
    })

    // jwt sign
    const token = await generateToken(newUser)

    res.status(201).json({
      message: 'Signup successful',
      user: newUser,
      token: token
    });

  } catch (error) {
    console.error('Error during signup:', error)
    res.status(500).json({ message: 'Internal Server Error', error: error.message })
  }
}

exports.LogIn = async (req, res) => {
  const { email, password } = req.body
  try {
    const existingUser = await User.findOne({ email: email })
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, existingUser.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect Password. Please try again' })
    }

    // jwt sign
    const token = await generateToken(existingUser)

    res.status(200).json({
      message: 'Logged in successfully!',
      role: existingUser.role,
      token: token
    })

  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ message: 'Internal Server Error', error: error.message })
  }
}

