const { check, param } = require('express-validator');

exports.createTaskValidator = [
  check('title')
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ min: 2}).withMessage('El título debe tener al menos 2 caracteres'),

  check('description')
    .optional()
    .isLength({ max: 100}).withMessage('La descripción no debe superar los 100 caracteres'),

  check('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('La prioridad debe ser "low", "medium" o "high"'),

  check('listId') 
    .notEmpty().withMessage('El id de la lista es obligatorio')
    .isMongoId().withMessage('El id de la lista no es valido'),

];

exports.updateTaskValidator = [
  param('id').isMongoId().withMessage('el Id de la tarea no es valido'),

  check('title')
    .optional()
    .isLength({ min: 2}).withMessage('El título debe tener al menos 2 caracteres'),

  check('description')
    .optional()
    .isLength({ max: 100}).withMessage('La descripción no debe superar los 100 caracteres'),

  check('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('La prioridad debe ser "low", "medium" o "high"'),

  check('completed')
    .optional()
    .isBoolean().withMessage('El campo "completado" debe ser un booleano'),
];

exports.taskIdParamValidator = [
  param('id').isMongoId().withMessage('ID invalido'),
];