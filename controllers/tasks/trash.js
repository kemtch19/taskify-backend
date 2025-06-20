const Task = require('../../models/tasks');

// eliminar una tarea de forma permanente por su id
const deleteTaskPermanently = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const task = await Task.findOneAndDelete({ _id: id, userId, isDeleted: true });

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada o no esta dentro de la papelera' });
        }

        if (task.userId.toString() !== userId.toString()) {
            return res.status(401).json({ message: 'No tienes permisos para eliminar esta tarea' });
        }

        res.json({ message: 'La tarea se ha eliminado permanentemente', task });
    } catch (err) {
        res.status(500).json({ message: 'error al eliminar la tarea', err });
    }
};

// vaciar la papelera (eliminar todas las tareas archivadas del usuario)
const emptyTrash = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await Task.deleteMany({ userId, isDeleted: true });

        await Task.deleteMany({ userId, isDeleted: true });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No hay tareas en la papelera' });
        }

        res.json({ message: 'La papelera se vacío', deletedCount: result.deletedCount });

    } catch (err) {
        res.status(500).json({ message: 'error al vaciar la papelera', err });
    }
};

// Obtener todas las tareas en la papelera
const getDeletedTasks = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await Task.find({ userId, isDeleted: true });

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'error al obtener las tareas', err });
    }
};

module.exports = { deleteTaskPermanently, emptyTrash, getDeletedTasks };