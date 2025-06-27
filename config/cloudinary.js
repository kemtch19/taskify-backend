const cloudinary = require('cloudinary').v2 ;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configuración de Cloudinary con variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración del almacenamiento de Cloudinary para multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'taskify-users',
        allowed_formats: ['jpg', 'png', 'jpeg', 'svg', 'webp'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }] // Transformación opcional
    }
});

module.exports = {
    storage,
    cloudinary
}   