const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {cloudinary} = require("../config/cloudinary"); // Importar configuración de Cloudinary

// endpoint para login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Correo electronico no encontrado" });
    }

    // comparación de password enviada con base de datos mediante bcrypt
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(404).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.status(200).json({
      message: "Usuario autenticado correctamente",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl || null, // Asegurarse de que siempre haya una URL de imagen
      },
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// Endpoint para registro de usuarios
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ message: "El correo ya se encuentra registrado" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

//endpoint para ver todos los usuarios
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password"); // no muestra la contraseña
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error en al Obtener el usuario",
      error: error.message,
    });
  }
};

// cambiar contraseña
const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Ambas contraseñas son requeridas" });
    }

    // Buscar al usuario
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña actual incorrecta" });
    }

    // Hashear nueva contraseña
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al cambiar la contraseña",
        error: error.message,
      });
  }
};

// Obtener el usuario por su token
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener el usuario actual",
        error: error.message,
      });
  }
};

// controlador para la imagen del usuario
const updateProfileImage = async (req, res) => {
  try {
    
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(404).json({ message: "No se recibio ninguna imagen" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.imagePublicId) {
      await cloudinary.uploader.destroy(user.imagePublicId);
    }

    // Actualizar imagen
    user.imageUrl = req.file.path; // Url de cloudinary
    user.imagePublicId = req.file.filename; // Public ID de cloudinary para las eliminaciones

    await user.save();

    res.status(200).json({
      message: "Imagen actualizada correctamente",
      imageUrl: user.imageUrl,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: error.message || error.toString(),
    });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getUserById,
  changePassword,
  getCurrentUser,
  updateProfileImage
};
