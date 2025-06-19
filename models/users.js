const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true,
  versionKey: false // esto desactiva el versionKey el cual me sirve para llevar el control de versiones de un documento cuando haces operaciones de concurrencia (como actualizaciones en paralelo)
});

// 🔒 Middleware: hashea antes de guardar
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  } catch (err) {
    return next(err);
  }
  next();
});

// 🔐 Método: comparar contraseñas al hacer login
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);