const { Product } = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Crear carpeta uploads si no existe
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generar nombre único con timestamp y extensión original
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Configuración de multer con validaciones
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: function (req, file, cb) {
    // Validar que sea una imagen
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

exports.uploadImage = upload.single("image");

// Crear producto
exports.createProduct = async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  try {
    const { name, description, unitPrice } = req.body;
    
    // Construir la ruta de la imagen
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    
    const product = await Product.create({ 
      name, 
      description, 
      unitPrice: parseFloat(unitPrice), // Asegurar que sea número
      image 
    });
    
    console.log("Producto creado:", product);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, unitPrice } = req.body;
    const product = await Product.findByPk(req.params.id);
    
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Si se subió una nueva imagen, usar la nueva; si no, mantener la anterior
    const image = req.file ? `/uploads/${req.file.filename}` : product.image;

    // Si hay una nueva imagen y existía una anterior, eliminar la anterior
    if (req.file && product.image) {
      const oldImagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("Imagen anterior eliminada:", oldImagePath);
      }
    }

    await product.update({ 
      name, 
      description, 
      unitPrice: parseFloat(unitPrice), 
      image 
    });
    
    console.log("Producto actualizado:", product);
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    // Eliminar la imagen del disco si existe
    if (product.image) {
      const imagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Imagen eliminada:", imagePath);
      }
    }
    
    await product.destroy();
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: error.message });
  }
};