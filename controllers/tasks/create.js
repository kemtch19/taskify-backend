const Task = require("../../models/tasks");

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
      userId,
    });

    res.status(201).json({ message: "Tarea creada correctamente", task });
  } catch (err) {
    res.status(500).json({ message: "error al crear la tarea", err });
  }
};

module.exports = createTask;
