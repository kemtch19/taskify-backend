const Task = require('../models/tasks');

// crear tarea
const createTask = async (req, res) => {
  try {
    const { title, description, priority, listId, folderId } = req.body;
    const userId = req.user.userId;

    const task = await Task.create({
      title,
      description,
      priority,
      listId,
      folderId,
      userId
    });

    res.status(201).json({ message: 'Tarea creada correctamente', task });
  } catch (err) {
    res.status(500).json({ message: 'error al crear la tarea', err });
  }
};

// obtener tareas activas de una lista especifica
const getTasksByList = async (req, res) => {
  try {
    const { listId } = req.params;
    const userId = req.user.userId;

    const tasks = await Task.find({ listId, userId, isDeleted: false });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'error al obtener las tareas', err });
  }
};

// obtener una sola tarea por id
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return res.status(404).json({ message: 'No se encontro la tarea' });
    }

    if (task.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: 'No tienes permisos para acceder a esta tarea' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'error al obtener la tarea', err });
  }
};

// actualizar tarea
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, completed } = req.body;
    const userId = req.user.userId;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { title, description, priority, completed },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'No se encontro la tarea' });
    }

    if (task.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: 'No tienes permisos para editar esta tarea' });
    }

    res.json({ message: 'La tarea se ha actualizado correctamente', task });
  } catch (err) {
    res.status(500).json({ message: 'error al actualizar la tarea', err });
  }
};

//archiva tarea (soft delete)
const archiveTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'No se encontro la tarea' });
    }

    if (task.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: 'No tienes permisos para editar esta tarea' });
    }

    res.json({ message: 'La tarea se ha archivado correctamente', task });
  } catch (err) {
    res.status(500).json({ message: 'error al archivar la tarea', err });
  }
};

// restaurar tarea de la papelera
const restoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'No se encontro la tarea' });
    }

    if (task.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: 'No tienes permisos para editar esta tarea' });
    }

    res.json({ message: 'La tarea se ha restaurado correctamente', task });
  } catch (err) {
    res.status(500).json({ message: 'error al restaurar la tarea', err });
  }
};

// eliminar una tarea de forma permanente por su id
const deleteTaskPermanently = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await Task.findOneAndDelete({ _id: id, userId, isDeleted: false });

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada o no esta dentro de la papelera' });
    }

    if (task.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: 'No tienes permisos para eliminar esta tarea' });
    }

    res.json({ message: 'La tarea se ha eliminado permanentemente', task });
  } catch (err) {
    res.status(500).json({ message: 'error al eliminar la tarea', err });
  }
};

// vaciar la papelera (eliminar todas las tareas archivadas del usuario)
const emptyTrash = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await Task.deleteMany({ userId, isDeleted: true });    

    await Task.deleteMany({ userId, isDeleted: true });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No hay tareas en la papelera' });
    }

    res.json({ message: 'La papelera se vacío', deletedCount: result.deletedCount });

  } catch (err) {
    res.status(500).json({ message: 'error al vaciar la papelera', err });
  }
};

// Obtener todas las tareas en la papelera
const getDeletedTasks = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await Task.find({ userId, isDeleted: true });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'error al obtener las tareas', err });
  }
};

module.exports = {
  createTask,
  getTasksByList,
  getTaskById,
  updateTask,
  archiveTask,
  restoreTask,
  deleteTaskPermanently,
  emptyTrash,
  getDeletedTasks
};