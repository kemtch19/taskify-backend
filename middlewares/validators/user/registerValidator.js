const { check } = require('express-validator');

exports.registerUserValidator = [
  check('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 15 }).withMessage('El nombre debe tener entre 3 y 15 caracteres'), 

  check('email')
    .isEmail().withMessage('El email ingresado no es valido'),

  check('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];