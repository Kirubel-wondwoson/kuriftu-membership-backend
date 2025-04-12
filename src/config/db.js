const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Successfully Connected!!")
  } catch (error) {
    console.log("It isn't Connected!!")
    process.exit(1)
  }
}
module.exports = connectDB