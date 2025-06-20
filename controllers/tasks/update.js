const Task = require('../../models/tasks');

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

module.exports = updateTask;