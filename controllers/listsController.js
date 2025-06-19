const List = require('../models/lists');

// endpoint para crear una lista
const createList = async (req, res) => {
  const { title, folderId } = req.body;
  const userId = req.user.userId;

  try {
    // Validar si ya existe una lista con ese título en ese folder y ese usuario
    const exist = await List.findOne({ title, folder: folderId, user: userId });
    if (exist) {
      return res.status(400).json({ message: 'Ya existe una lista con ese título en esta carpeta' });
    }

    const newList = await List.create({ title, folder: folderId, user: userId });
    res.status(201).json(newList);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ya existe una lista con ese nombre' });
    }
    res.status(500).json({ message: 'Error al crear la lista', error: error.message });
  }
};

// endpoint para obtener todas las listas de un usuario
const getListsByFolder = async (req, res) => {
  const { folderId } = req.params;
  const userId = req.user.userId;

  try {
    const lists = await List.find({ folder: folderId, user: userId });
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las listas', error: error.message });
  }
};

// endpoint para editar una lista
const updateList = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const userId = req.user.userId;

  try {
    const list = await List.findById(id);

    // Verificar si ya existe otra lista con el mismo título en la misma carpeta y del mismo usuario
    const exist = await List.findOne({
      _id: { $ne: id }, // excluir la lista actual
      title,
      folder: list.folder,
      user: userId
    });

    if (exist) {
      return res.status(400).json({ message: 'Ya existe una lista con ese título en esta carpeta' });
    }

    if (!list) {
      return res.status(404).json({ message: 'Lista no encontrada' });
    }

    if (list.user.toString() !== userId) {
      return res.status(401).json({ message: 'No tienes permisos para editar esta lista' });
    }

    list.title = title || list.title;
    const updatedList = await list.save();

    res.status(200).json(updatedList);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ya existe una lista con ese nombre' });
    }
    res.status(500).json({ message: 'Error al editar la lista', error: error.message });
  }
};

// endpoint para eliminar una lista
const deleteList = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const list = await List.findById(id);

    if (!list) {
      return res.status(404).json({ message: 'Lista no encontrada' });
    }

    if (list.user.toString() !== userId) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar esta lista' });
    }

    await List.findByIdAndDelete(id);

    res.status(200).json({ message: 'Lista eliminada correctamente' });

  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la lista', error: error.message });
  }
};

module.exports = {
  createList,
  getListsByFolder,
  updateList,
  deleteList
};