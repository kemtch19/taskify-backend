const { check, param } = require('express-validator');

exports.createFolderValidator = [
  check('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2}).withMessage('El nombre debe tener al menos 2 caracteres'),
];

exports.updateFolderValidator = [
  param('id').isMongoId().withMessage('ID invalido'),
  check('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2}).withMessage('El nombre debe tener al menos 2 caracteres'),
];

exports.deleteFolderValidator = [
  param('id').isMongoId().withMessage('ID invalido'),
];  