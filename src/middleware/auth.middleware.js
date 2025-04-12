const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Get token from headers
  const token = req.headers.authorization?.split(" ")[1]; // Extract "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token payload to request object
    next(); 
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = {authenticateToken}
