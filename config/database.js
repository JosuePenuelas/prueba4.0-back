// config/database.js
const { Sequelize } = require('sequelize');
const config = require('./config.json'); // Carga la configuración del JSON

// Determina qué entorno usar (development por defecto)
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Crea la instancia de Sequelize usando la configuración cargada
const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  storage: dbConfig.storage
});

module.exports = sequelize;