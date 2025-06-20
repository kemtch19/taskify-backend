const express = require('express');
const router = express.Router();

const taskController = require('../controllers/tasks');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createTaskValidator,
  updateTaskValidator,
  taskIdParamValidator
} = require('../middlewares/validators/tasks/taskValidators');
const validateResult = require('../middlewares/validators/errors/validateResult');

// Crear una nueva tarea
router.post(
  '/create',
  authMiddleware,
  createTaskValidator,
  validateResult,
  taskController.createTask
);

// Obtener tareas activas de una lista
router.get(
  '/list/:listId',
  authMiddleware,
  taskController.getTasksByList
);

// Obtener una tarea específica por ID
router.get(
  '/get/:id',
  authMiddleware,
  taskIdParamValidator,
  validateResult,
  taskController.getTaskById
);

// Buscar tareas por palabra clave
router.get(
  '/search',
  authMiddleware,
  taskController.searchTasks
);

// Obtener tareas por rango de fechas
router.get(
  '/range',
  authMiddleware,
  taskController.getTasksByDateRange
);

// Actualizar una tarea
router.put(
  '/update/:id',
  authMiddleware,
  updateTaskValidator,
  validateResult,
  taskController.updateTask
);

// Archivar una tarea (mover a papelera)
router.patch(
  '/archive/:id',
  authMiddleware,
  taskIdParamValidator,
  validateResult,
  taskController.archiveTask
);

// Restaurar una tarea archivada
router.patch(
  '/restore/:id',
  authMiddleware,
  taskIdParamValidator,
  validateResult,
  taskController.restoreTask
);

// Mover una tarea a otra lista
router.patch(
  '/move/:id',
  authMiddleware,
  validateResult,
  taskController.moveTaskToAnotherList
);

// Obtener tareas archivadas (papelera)
router.get(
  '/trash',
  authMiddleware,
  taskController.getDeletedTasks
);

// Eliminar una tarea de forma permanente
router.delete(
  '/delete/:id',
  authMiddleware,
  taskIdParamValidator,
  validateResult,
  taskController.deleteTaskPermanently
);

// Vaciar papelera del usuario
router.delete(
  '/empty-trash',
  authMiddleware,
  taskController.emptyTrash
);

// marcar una tarea como completada o no
router.patch(
  '/toggle/:id',
  authMiddleware,
  taskIdParamValidator,
  validateResult,
  taskController.toggleTaskCompletion
);

module.exports = router;