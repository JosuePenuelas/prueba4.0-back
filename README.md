# Backend Node.js con Express

Este es un proyecto backend desarrollado en **Node.js** usando **Express**. Está diseñado para manejar APIs REST y es ideal para integrarse con aplicaciones frontend. Se incluye **Nodemon** para desarrollo en caliente.

---

## 🛠 Tecnologías

- Node.js
- Express
- Nodemon (para desarrollo)
- Sequelize / Mongoose (opcional, según base de datos)
- dotenv (para variables de entorno)

---

## 📁 Estructura del proyecto
backend/
├─ node_modules/
├─ src/
│ ├─ controllers/
│ ├─ models/
│ ├─ routes/
│ ├─ middlewares/
│ ├─ utils/
│ └─ app.js
├─ .env
├─ package.json
└─ README.md


- **controllers/** → Funciones que manejan la lógica de cada ruta.
- **models/** → Definición de modelos de base de datos.
- **routes/** → Definición de rutas de la API.
- **middlewares/** → Funciones intermedias (auth, logging, etc.).
- **utils/** → Funciones auxiliares o helpers.
- **app.js** → Archivo principal donde se inicializa el servidor Express.

---

## ⚡ Instalación

# Clona el repositorio:

git clone https://github.com/tu-usuario/tu-backend.git
cd tu-backend
npm install

# variable de entorno
PORT=3000
JWT_SECRET=tu_secreto

# iniciar el servidor
nodemon app.js

