# 📝 Taskify Backend

Taskify es una API RESTful para una aplicación de gestión de tareas tipo To-Do List, desarrollada con **Node.js**, **Express** y **MongoDB**. Soporta autenticación con JWT, operaciones CRUD para usuarios, carpetas, listas y tareas, incluyendo funcionalidades como papelera de reciclaje para tareas.

---

## 📦 Tecnologías

- Node.js
- Express
- MongoDB + Mongoose
- JWT para autenticación
- bcrypt para hashing de contraseñas
- express-validator para validación
- dotenv para configuración

---

## 🚀 Instalación

```bash
git clone https://github.com/tu-usuario/taskify-backend.git
cd taskify-backend
npm install
```

---

## ⚙️ Variables de entorno (`.env`)

Crea un archivo `.env` en la raíz con:

```
PORT=5000
MONGO_URI=uri_de_mongodb
JWT_SECRET=clave_secreta
```

---

## ▶️ Ejecución del servidor

```bash
npm run dev
```

Servidor disponible en: `http://localhost:5000`

---

## 🔐 Autenticación

Todas las rutas (excepto registro y login) están protegidas con **JWT**.

Agrega este header en Postman o en tu cliente:

```
Authorization: Bearer TU_TOKEN
```

---

## 📁 Endpoints disponibles

---

### 👤 Usuarios

| Método | Ruta                  | Descripción                     |
| ------ | --------------------- | ------------------------------- |
| POST   | `/api/users/register` | Registrar nuevo usuario         |
| POST   | `/api/users/login`    | Iniciar sesión y obtener JWT    |

---

### 📂 Folders (Carpetas)

| Método | Ruta                      | Descripción                            |
| ------ | ------------------------- | -------------------------------------- |
| POST   | `/api/folders/create`     | Crear una nueva carpeta                |
| GET    | `/api/folders`            | Obtener todas las carpetas del usuario |
| PUT    | `/api/folders/update/:id` | Actualizar nombre de una carpeta       |
| DELETE | `/api/folders/delete/:id` | Eliminar una carpeta                   |

---

### 🗃️ Lists (Listas)

| Método | Ruta                          | Descripción                             |
| ------ | ----------------------------- | --------------------------------------- |
| POST   | `/api/lists/create`           | Crear nueva lista dentro de una carpeta |
| GET    | `/api/lists/folder/:folderId` | Obtener listas por carpeta              |
| PUT    | `/api/lists/update/:id`       | Actualizar una lista                    |
| DELETE | `/api/lists/delete/:id`       | Eliminar una lista                      |

---

### ✅ Tasks (Tareas)

| Método | Ruta                      | Descripción                                          |
| ------ | ------------------------- | ---------------------------------------------------- |
| POST   | `/api/tasks/create`       | Crear una nueva tarea                                |
| GET    | `/api/tasks/list/:listId` | Obtener todas las tareas activas de una lista        |
| GET    | `/api/tasks/:id`          | Obtener una sola tarea                               |
| PUT    | `/api/tasks/update/:id`   | Actualizar tarea (título, descripción, prioridad...) |
| PUT    | `/api/tasks/archive/:id`  | Archivar tarea (mover a papelera)                    |
| PUT    | `/api/tasks/restore/:id`  | Restaurar tarea desde papelera                       |
| DELETE | `/api/tasks/delete/:id`   | Eliminar permanentemente una tarea                   |
| DELETE | `/api/tasks/empty-trash`  | Vaciar papelera del usuario                          |
| GET    | `/api/tasks/trash`        | Obtener todas las tareas archivadas                  |

---

## 🧪 Ejemplo de petición: Crear tarea

```http
POST /api/tasks/create
Authorization: Bearer TU_TOKEN
Content-Type: application/json

{
  "title": "Llamar al doctor",
  "description": "Agendar cita médica",
  "priority": "medium",
  "listId": "LIST_ID",
  "folderId": "FOLDER_ID"
}
```

---

## 🧠 Notas

- Todos los `:id` deben ser IDs válidos de MongoDB.
- `priority` puede ser: "low", "medium" o "high".
- Tareas archivadas no se incluyen en los listados normales, pero pueden restaurarse o eliminarse desde la papelera.

---

## 📂 Estructura del proyecto

```
taskify-backend/
├── controllers/
│   ├── foldersController.js
│   ├── listsController.js
│   ├── tasksController.js
│   └── usersController.js
├── models/
│   ├── Folder.js
│   ├── List.js
│   ├── Task.js
│   └── User.js
├── routes/
│   ├── foldersRoutes.js
│   ├── listsRoutes.js
│   ├── tasksRoutes.js
│   └── usersRoutes.js
├── validators/
├── middlewares/
├── .env
├── app.js
├── package.json
└── README.md
```

---

## 👨‍💻 Autores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/kemtch19">
        <img src="https://avatars.githubusercontent.com/u/92267985?v=4" width="100px;" alt="kemtch19"/>
        <br />
        <sub><b>kemtch19</b></sub>
      </a>
    </td>    
  </tr>
</table>

