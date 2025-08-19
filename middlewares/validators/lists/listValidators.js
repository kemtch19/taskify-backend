const { check, param } = require('express-validator');

exports.createListValidator = [
  check('title')
    .notEmpty().withMessage('El título de la lista es obligatorio')
    .isLength({ min: 2 }).withMessage('El título debe tener al menos 2 caracteres'),

  check('folderId')
    .notEmpty().withMessage('El folderId es obligatoria')
    .isMongoId().withMessage('el folderId debe ser un ID de mongo válido'),
];

exports.updateListValidator = [
  param("id")
    .isMongoId()
    .withMessage("El ID de la lista no es válido"),

  check("title")
    .optional() 
    .isLength({ min: 2 })
    .withMessage("El título debe tener al menos 2 caracteres"),

  check("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser un texto"),

  check("icon")
    .optional()
    .isString()
    .withMessage("El icono debe ser un texto"),
];

exports.deleteListValidator = [
  param('id').isMongoId().withMessage('ID invalido'),
];

exports.getListsByFolderValidator = [
  param('folderId').isMongoId().withMessage('El id del folder debe ser valido'),
];