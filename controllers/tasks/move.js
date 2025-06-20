const Task = require("../../models/tasks");
const List = require("../../models/lists");

// mover tarea a otra lista
const moveTaskToAnotherList = async (req, res) => {
  try {
    const { id } = req.params;
    const { newListId } = req.body;
    const userId = req.user.userId;

    // Buscar lista destino
    const list = await List.findOne({
      _id: newListId,
      user: userId,
    });

    if (!list) {
      return res
        .status(404)
        .json({ message: "Lista no encontrada o no pertenece al usuario" });
    }

    // Actualizar tarea
    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { listId: newListId },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.json({ message: "Tarea movida exitosamente", task });
  } catch (err) {
    res.status(500).json({ message: "error al mover la tarea", err });
  }
};

module.exports = moveTaskToAnotherList;
