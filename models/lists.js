const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
},
  {
    timestamps: true,
    versionKey: false
  });

// evita duplicados por título, carpeta que venga del mismo usuario
listSchema.index({ title: 1, folder: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('List', listSchema);