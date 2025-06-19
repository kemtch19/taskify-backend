const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("desde el middleware: ", decoded.userId);
    req.user = { userId: decoded.userId};
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalido' });
  }
};

module.exports = authMiddleware;