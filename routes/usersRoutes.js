const express = require('express');
const router = express.Router();
const { registerUser, getUserById, loginUser } = require('../controllers/usersController');
// import validadores
const { registerUserValidator } = require('../middlewares/validators/user/registerValidator');
const { loginUserValidator } = require('../middlewares/validators/user/loginValidator');
const validateResult = require('../middlewares/validators/errors/validateResult');

//ruta para login
router.post('/login', loginUserValidator, validateResult, loginUser);

// ruta register, ya en app.js definimos la ruta para todos los archivos que tengamos aquí, y por ende todas las rutas de users van aquí, ya que en app.js se define la ruta de /api/user en general y ya acá se la damos en especifico /api/user/register
router.post('/register', registerUserValidator, validateResult, registerUser);

//ruta para ver todos los usuarios
router.get('/:id', getUserById);

module.exports = router;