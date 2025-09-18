const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticateToken = require("../middleware/auth");

router.post("/", authenticateToken, productController.uploadImage, productController.createProduct);
router.get("/", authenticateToken, productController.getProducts);
router.get("/:id", authenticateToken, productController.getProduct);
router.put("/:id", authenticateToken, productController.uploadImage, productController.updateProduct);
router.delete("/:id", authenticateToken, productController.deleteProduct);

module.exports = router;
