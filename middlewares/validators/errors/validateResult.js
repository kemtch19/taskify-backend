// middlewares/validators/validateResult.js
const { validationResult } = require('express-validator');

const validateResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Errores de validación",
      errors: errors.array()
    });
  }

  next();
};

module.exports = validateResult;