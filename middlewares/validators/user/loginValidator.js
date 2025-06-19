const { validationResult, check } = require('express-validator');

exports.loginUserValidator = [
  check('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email ingresado no es valido'),

  check('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
]; 