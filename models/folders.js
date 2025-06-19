const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
  {
    timestamps: true,
    versionKey: false
  });

// ⛔️ Esta línea evita duplicados por nombre del folder que venga del mismo usuario
folderSchema.index({ name: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Folder', folderSchema);