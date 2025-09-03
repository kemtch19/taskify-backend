const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { cloudinary } = require("../config/cloudinary"); // Importar configuración de Cloudinary

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
      process.env.JWT_SECRET
    );

    // ✅ Enviar token en una cookie HTTP-only
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // solo en HTTPS en prod
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // o 'Lax' según tu configuración
    });

    res.status(200).json({
      message: "Usuario autenticado correctamente",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl || null, // Asegurarse de que siempre haya una URL de imagen
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax", // o 'Lax' si usas múltiples subdominios
  });

  res.status(200).json({ message: "Sesión cerrada correctamente" });
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
    res.status(500).json({
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
    res.status(500).json({
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

// Cambiar nombre del usuario
const updateUserName = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { newName } = req.body;

    if (!newName || newName.trim().length < 2) {
      return res.status(400).json({ message: "Nombre inválido" });
    }

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    user.name = newName.trim();
    await user.save();

    res
      .status(200)
      .json({ message: "Nombre actualizado correctamente", name: user.name });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el nombre", error: error.message });
  }
};

// Cambiar correo del usuario
const updateUserEmail = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { newEmail } = req.body;

    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return res.status(400).json({ message: "Correo electrónico inválido" });
    }

    // Verificar que el nuevo correo no esté en uso
    const emailInUse = await User.findOne({ email: newEmail });
    if (emailInUse && emailInUse._id.toString() !== userId) {
      return res.status(400).json({ message: "Este correo ya está en uso" });
    }

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    user.email = newEmail.toLowerCase().trim();
    await user.save();

    res
      .status(200)
      .json({ message: "Correo actualizado correctamente", email: user.email });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el correo", error: error.message });
  }
};

// Eliminar imagen de perfil del usuario
const deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.imagePublicId) {
      // Eliminar la imagen de Cloudinary
      await cloudinary.uploader.destroy(user.imagePublicId);

      // Limpiar campos en la base de datos
      user.imageUrl = "undefined";
      user.imagePublicId = null;
      await user.save();

      return res
        .status(200)
        .json({ message: "Imagen eliminada correctamente" });
    } else {
      return res
        .status(400)
        .json({ message: "El usuario no tiene imagen de perfil" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la imagen",
      error: error.message,
    });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getUserById,
  changePassword,
  getCurrentUser,
  updateProfileImage,
  logoutUser,
  updateUserName,
  updateUserEmail,
  deleteProfileImage,
};
