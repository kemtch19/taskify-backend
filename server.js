const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});