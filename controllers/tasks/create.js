const Task = require("../../models/tasks");

// crear tarea
const createTask = async (req, res) => {
  try {
    const { title, description, priority, listId, folderId, icon } = req.body;
    const userId = req.user.userId;

    const existingTask = await Task.findOne({
      title,
      listId,
      userId,
      isDeleted: false, // Si usas papelera, excluye eliminadas
    });

    if (existingTask) {
      return res
        .status(400)
        .json({ message: "Ya existe una tarea con ese título en esta lista" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      listId,
      folderId,
      userId,
      icon,
    });

    res.status(201).json({ message: "Tarea creada correctamente", task });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Ya existe una tarea con ese nombre" });
    }
    res
      .status(500)
      .json({ message: "Error al crear la tarea", error: error.message });
  }
};

module.exports = createTask;
