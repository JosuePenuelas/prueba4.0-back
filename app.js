require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Permitir solicitudes desde tu frontend
app.use(cors({
  origin: "http://localhost:4000", // dirección de tu frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// IMPORTANTE: Servir archivos estáticos ANTES de express.json()
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware para parsing
app.use(express.json());

// Rutas
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const saleRoutes = require("./routes/saleRoutes");

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));