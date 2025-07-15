const { check, param, body } = require('express-validator');

exports.createTaskValidator = [
  check('title')
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ min: 2}).withMessage('El título debe tener al menos 2 caracteres'),

  check('description')
    .optional()
    .isLength({ max: 100}).withMessage('La descripción no debe superar los 100 caracteres'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('La prioridad debe ser "low", "medium" o "high"'),

  check('listId') 
    .notEmpty().withMessage('El id de la lista es obligatorio')
    .isMongoId().withMessage('El id de la lista no es valido'),

  check('folderId')
    .notEmpty().withMessage('El id de la carpeta es obligatorio')
    .isMongoId().withMessage('El id de la carpeta no es valido'),
];

exports.updateTaskValidator = [
  body('title')
    .optional()
    .isString().withMessage('El título debe ser un texto')
    .isLength({ min: 2 }).withMessage('El título debe tener al menos 2 caracteres'),

  body('description')
    .optional()
    .isString().withMessage('La descripción debe ser un texto'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('La prioridad debe ser low, medium o high'),

  body('completed')
    .optional()
    .isBoolean().withMessage('El estado completed debe ser booleano'),

  body('icon')
    .optional()
    .isString().withMessage('El icono debe ser un texto'),
];

exports.taskIdParamValidator = [
  param('id').isMongoId().withMessage('ID invalido'),
];