const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds); 
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error; 
  }
};

const generateToken = async (user) => {
  try {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    }
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'})
    return accessToken;
  } catch (error) {
    console.error("Error generating token:", error)
    throw error;
  }
}
module.exports = {hashPassword, generateToken}