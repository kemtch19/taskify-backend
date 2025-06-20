const User = require('../models/users');
const jwt = require('jsonwebtoken');

// endpoint para login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Correo electronico no encontrado' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.status(200).json({
      message: 'Usuario autenticado correctamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Endpoint para registro de usuarios
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'El correo ya se encuentra registrado' });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

//endpoint para ver todos los usuarios
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-password'); // no muestra la contraseña
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error en al Obtener el usuario",
      error: error.message
    })
  }
}

// cambiar contraseña
const changePassword = async (req, res) => {
  try {
    const { currentPassword, password } = req.body;
    const userId = req.user.userId;

    // vamos a validar que se envien ambos campos
    if (!currentPassword || !password) {
      return res.status(400).json({ message: 'Debes enviar ambos campos' });
    }

    // vamos a buscar al usuario en la base de datos
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // vamos a verificar que la contraseña actual sea correcta
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña actual incorrecta' });
    } 

    // vamos a hashear y a guardar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ message: 'Contraseña cambiada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'error al cambiar la contraseña', err });
  }
};  

module.exports = {
  loginUser,
  registerUser,
  getUserById,
  changePassword
};