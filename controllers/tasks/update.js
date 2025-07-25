const Task = require('../../models/tasks');

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { title } = req.body;

    // Buscar la tarea actual
    const currentTask = await Task.findOne({ _id: id, userId });

    if (!currentTask) {
      return res.status(404).json({ message: 'No se encontró la tarea' });
    }

    // Validar si se intenta actualizar el título
    if (title && title !== currentTask.title) {
      const duplicateTask = await Task.findOne({
        title,
        userId,
        listId: currentTask.listId,
        _id: { $ne: id }, // Excluir la tarea actual
        isDeleted: false // Excluir tareas eliminadas si usas papelera
      });

      if (duplicateTask) {
        return res.status(400).json({ message: 'Ya existe otra tarea con ese título en esta lista' });
      }
    }

    // Definir los campos permitidos para actualizar (no incluye createdAt)
    const allowedFields = ['title', 'description', 'priority', 'completed', 'icon'];

    // Construir el objeto con los campos a actualizar
    const fieldsToUpdate = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    // Realizar la actualización
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId },
      fieldsToUpdate,
      { new: true }
    );

    res.json({ message: 'La tarea se ha actualizado correctamente', task: updatedTask });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Ya existe una tarea con ese nombre" });
    }
    res.status(500).json({ message: "Error al actualizar la tarea", error: error.message });
  }
};

module.exports = updateTask;
