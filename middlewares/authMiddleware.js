const jwt = require("jsonwebtoken");

/**
 * Middleware de autenticación con cookies HTTPOnly
 * Verifica el token presente en req.cookies.token y lo decodifica.
 */
const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token; // Verifica si existe la cookie

  if (!token) {
    return res.status(401).json({ message: "No autorizado: Token no presente" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agrega el usuario decodificado al request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;
