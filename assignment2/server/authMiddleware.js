const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // Verify and decode the token
    const secretKey = '123456789'; // Replace with your own secret key
    const decoded = jwt.verify(token, secretKey);

    // Attach the decoded user ID to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
