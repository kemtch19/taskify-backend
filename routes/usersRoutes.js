const express = require('express');
const router = express.Router();
// import validadores
const { registerUserValidator } = require('../middlewares/validators/user/registerValidator');
const { loginUserValidator } = require('../middlewares/validators/user/loginValidator');
const validateResult = require('../middlewares/validators/errors/validateResult');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const { changePasswordValidator } = require('../middlewares/validators/user/usersValidator');

// ruta para ver el usuario actual
router.get('/me', authMiddleware, getCurrentUser);

//ruta para login
router.post('/login', loginUserValidator, validateResult, loginUser);

// ruta para logout
router.post('/logout', authMiddleware, logoutUser);

// ruta register, ya en app.js definimos la ruta para todos los archivos que tengamos aquí, y por ende todas las rutas de users van aquí, ya que en app.js se define la ruta de /api/user en general y ya acá se la damos en especifico /api/user/register
router.post('/register', registerUserValidator, validateResult, registerUser);

// ruta para cambiar contraseña
router.patch('/change-password', authMiddleware, changePasswordValidator, validateResult, changePassword);

// ruta para actualizar la imagen del usuario
router.post('/update-profile-image', authMiddleware, uploadMiddleware.single('image'), updateProfileImage);


//ruta para ver todos los usuarios
router.get('/:id', getUserById);

module.exports = router;