const Task = require("../../models/tasks");

// obtener tareas activas de una lista especifica
const getTasksByList = async (req, res) => {
  try {
    const { listId } = req.params;
    const userId = req.user.userId;

    const tasks = await Task.find({ listId, userId, isDeleted: false });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "error al obtener las tareas", err });
  }
};

// obtener una sola tarea por id
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return res.status(404).json({ message: "No se encontro la tarea" });
    }

    if (task.userId.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ message: "No tienes permisos para acceder a esta tarea" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "error al obtener la tarea", err });
  }
};

module.exports = { getTaskById, getTasksByList };
