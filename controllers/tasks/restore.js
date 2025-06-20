const Task = require("../../models/tasks");

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
      return res.status(404).json({ message: "No se encontro la tarea" });
    }

    if (task.userId.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ message: "No tienes permisos para editar esta tarea" });
    }

    res.json({ message: "La tarea se ha restaurado correctamente", task });
  } catch (err) {
    res.status(500).json({ message: "error al restaurar la tarea", err });
  }
};

module.exports = restoreTask;
