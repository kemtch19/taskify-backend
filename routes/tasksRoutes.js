const express = require('express');
const router = express.Router();

const { createTask, getTasksByList, getTaskById, updateTask, archiveTask, restoreTask, deleteTaskPermanently, emptyTrash, getDeletedTasks } = require('../controllers/tasksController');
const { createTaskValidator, updateTaskValidator, taskIdParamValidator } = require('../middlewares/validators/tasks/taskValidators');

const authMiddleware = require('../middlewares/authMiddleware');
const validateResult = require('../middlewares/validators/errors/validateResult');

router.post('/create', authMiddleware, createTaskValidator, validateResult, createTask); // crear tarea
router.get('/list/:listId', authMiddleware, getTasksByList); // obtener tareas activas de una lista especifica
router.get('/trash', authMiddleware, getDeletedTasks); // obtener todas las tareas en la papelera
router.get('/:id', authMiddleware, taskIdParamValidator, validateResult,getTaskById); // obtener una sola tarea por id
router.put('/update/:id', authMiddleware,  updateTaskValidator, validateResult, updateTask); // actualizar tarea
router.patch('/archive/:id', authMiddleware, taskIdParamValidator, archiveTask); //archiva tarea (mover a la papelera)
router.patch('/restore/:id', authMiddleware, taskIdParamValidator, validateResult, restoreTask); // restaurar tarea desde la papelera
router.delete('/delete/:id', authMiddleware, taskIdParamValidator, validateResult, deleteTaskPermanently); // eliminar una tarea de forma permanente por su id
router.delete('/empty-trash', authMiddleware, emptyTrash); // vaciar la papelera (eliminar todas las tareas archivadas del usuario)

module.exports = router;