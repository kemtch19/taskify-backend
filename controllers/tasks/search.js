const Task = require('../../models/tasks');
const { DateTime } = require('luxon');

// Buscar tareas por palabra clave
const searchTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Debes introducir una palabra a buscar' });
    }

    const regex = new RegExp(q, 'i');

    const tasks = await Task.find({
      userId,
      isDeleted: false,
      $or: [
        { title: regex },
        { description: regex }
      ]
    })

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'error al buscar las tareas', err });
  }
};

// Obtener tarea por un rango de fecha
const getTasksByDateRange = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { start, end } = req.query;

    console.log('Fechas recibidas:', { start, end });

    if (!start || !end) {
      return res.status(400).json({ message: 'Debes introducir una fecha inicial y final' });
    }

    const timeZone = 'America/Bogota';

    const startDate = DateTime.fromISO(start, { zone: timeZone }).startOf('day').toJSDate();
    const endDate = DateTime.fromISO(end, { zone: timeZone }).endOf('day').toJSDate();

    console.log('Rango final:', { startDate, endDate });

    const tasks = await Task.find({
      userId,
      isDeleted: false,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    res.status(200).json(tasks);
  } catch (err) {
    console.error('🔥 Error interno:', err.message);
    res.status(500).json({ message: 'Error al obtener tareas por fecha', error: err.message });
  }
};

module.exports = {searchTasks, getTasksByDateRange};