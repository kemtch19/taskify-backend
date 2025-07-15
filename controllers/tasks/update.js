const Task = require('../../models/tasks');

// actualizar tarea
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Solo actualiza los campos que vienen en el body
    const fieldsToUpdate = {};
    const allowedFields = ['title', 'description', 'priority', 'completed', 'icon'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      fieldsToUpdate,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'No se encontró la tarea' });
    }

    res.json({ message: 'La tarea se ha actualizado correctamente', task });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar la tarea', err });
  }
};

module.exports = updateTask;