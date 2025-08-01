const Task = require("../../models/tasks");

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
      return res.status(404).json({ message: "No se encontro la tarea" });
    }

    if (task.userId.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ message: "No tienes permisos para editar esta tarea" });
    }

    res.json({ message: "La tarea se ha archivado correctamente", task });
  } catch (err) {
    res.status(500).json({ message: "error al archivar la tarea", err });
  }
};

module.exports = archiveTask;
