const express = require('express');
const router = express.Router();
const { createList, getListsByFolder, updateList, deleteList } = require('../controllers/listsController');
const { createListValidator, updateListValidator, deleteListValidator, getListsByFolderValidator } = require('../middlewares/validators/lists/listValidators');
const validateResult = require('../middlewares/validators/errors/validateResult');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, createListValidator, validateResult, createList);
router.get('/get/:folderId', authMiddleware, getListsByFolderValidator, validateResult, getListsByFolder);
router.put('/update/:id', authMiddleware, updateListValidator, validateResult, updateList);
router.delete('/delete/:id', authMiddleware, deleteListValidator, validateResult, deleteList);

module.exports = router;