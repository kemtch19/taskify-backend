const {body} = require('express-validator');

exports.changePasswordValidator = [
  body('currentPassword')
    .notEmpty().withMessage('La contraseña actual es obligatoria'),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];