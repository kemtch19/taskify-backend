const Task = require('../../models/tasks');

const toggleTaskCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
      return res.status(404).json({ message: 'No se encontro la tarea' });
    }

    if (task.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: 'No tienes permisos para editar esta tarea' });
    }

    // niega la tarea y la cambia al otro valor que venga de la base de datos true=false y se guarda en la base de datos
    task.completed = !task.completed;
    await task.save();

    res.json({ 
        message: `Tarea marcada como ${task.completed ? 'completada' : 'pendiente'}`,
        task 
    });
  } catch (err) {
    res.status(500).json({ message: 'error al cambiar la tarea', err });
  }
};

module.exports = toggleTaskCompletion;