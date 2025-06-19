const express = require('express');
const router = express.Router();
const { createFolder, getUserFolders, updateFolder, deleteFolder } = require('../controllers/foldersController');
const authMiddleware = require('../middlewares/authMiddleware');
const { createFolderValidator, updateFolderValidator, deleteFolderValidator } = require('../middlewares/validators/folder/folderValidators');
const validateResult = require('../middlewares/validators/errors/validateResult');

router.post('/create', authMiddleware, createFolderValidator, validateResult,createFolder); // crear una carpeta
router.get('/get', authMiddleware, getUserFolders); // obtener todas las carpetas de un usuario
router.put('/update/:id', authMiddleware, updateFolderValidator, validateResult, updateFolder); // actualizar una carpeta
router.delete('/delete/:id', authMiddleware, deleteFolderValidator, validateResult, deleteFolder); // eliminar una carpeta

module.exports = router;