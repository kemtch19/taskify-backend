const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');

// 🛡️ Middlewares de seguridad
const helmet = require("helmet");

const usersRoutes = require("./routes/usersRoutes");
const folderRoutes = require("./routes/foldersRoutes");
const listsRouters = require("./routes/listsRoutes");
const tasksRouters = require("./routes/tasksRoutes");

dotenv.config();
const app = express();

// ✅ Middleware para parsear JSON y cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Seguridad general
app.use(helmet()); // Cabeceras seguras

// ✅ CORS con soporte para cookies
app.use(cors({
  origin: process.env.CLIENT_URL || process.env.FRONT_URL, // Asegúrate de definir correctamente tu frontend
  credentials: true, // 🔥 permite enviar cookies entre dominios
}));

// ✅ Rutas principales
app.use("/api/users", usersRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/lists", listsRouters);
app.use("/api/tasks", tasksRouters);

// ✅ Endpoint para verificar estado del servidor
app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});

// ✅ Middleware global de errores
app.use((err, req, res, next) => {
  console.error("🌩️ Error capturado en middleware global:", err);
  res.status(500).json({
    message: "Error inesperado del servidor",
    error: err.message || err.toString(),
  });
});

module.exports = app;