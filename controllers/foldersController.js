const Folder = require('../models/folders');

// endpoint para crear una carpeta
const createFolder = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  try {
    // Verificar si ya existe una carpeta con ese nombre para este usuario
    const exists = await Folder.findOne({ name, user: userId });

    if (exists) {
      return res.status(400).json({ message: 'Ya tienes una carpeta con ese nombre' });
    }

    const folder = await Folder.create({ name, user: userId });
    res.status(201).json(folder);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ya existe un folder con ese nombre' });
    }
    res.status(500).json({ message: 'Error al crear la carpeta', error: error.message });
  }
};

// endpoint para obtener todas las carpetas de un usuario
const getUserFolders = async (req, res) => {
  const userId = req.user.userId;

  try {
    const folders = await Folder.find({ user: userId });

    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las carpetas', error: error.message });
  }
};

// endpoint para editar una carpeta
const updateFolder = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { name } = req.body;

  try {
    const folder = await Folder.findById(id);
    if (!folder) {
      return res.status(404).json({ message: 'Carpeta no encontrada' });
    }

    if (folder.user.toString() !== userId) {
      return res.status(401).json({ message: 'No tienes permisos para editar esta carpeta' });
    }

    // Verificar si ya existe otra carpeta con ese nombre para este usuario
    const exists = await Folder.findOne({
      _id: { $ne: id },
      name,
      user: userId
    });

    if (exists) {
      return res.status(400).json({ message: 'Ya tienes otra carpeta con ese nombre' });
    }

    folder.name = name || folder.name;
    const updatedFolder = await folder.save();

    res.status(200).json(updatedFolder);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ya existe un folder con ese nombre' });
    }
    res.status(500).json({ message: 'Error al editar la carpeta', error: error.message });
  }
};

// endpoint para eliminar una carpeta
const deleteFolder = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const folder = await Folder.findById(id);

    if (!folder) {
      return res.status(404).json({ message: 'Carpeta no encontrada' });
    }

    if (folder.user.toString() !== userId) {
      return res.status(401).json({ message: 'No tienes permisos para eliminar esta carpeta' });
    }

    await Folder.findByIdAndDelete(id);
    res.status(200).json({ message: 'Carpeta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la carpeta', error: error.message });
  }
};

module.exports = {
  createFolder,
  getUserFolders,
  updateFolder,
  deleteFolder
};