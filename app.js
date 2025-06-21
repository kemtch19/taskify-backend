const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const usersRoutes = require('./routes/usersRoutes');
const folderRoutes = require('./routes/foldersRoutes');
const listsRouters = require('./routes/listsRoutes');
const tasksRouters = require('./routes/tasksRoutes');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', usersRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/lists', listsRouters);
app.use('/api/tasks', tasksRouters);

app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

module.exports = app;