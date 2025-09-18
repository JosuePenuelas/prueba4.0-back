const express = require("express");
const router = express.Router();
const saleController = require("../controllers/saleController");
<<<<<<< HEAD

router.post("/", saleController.createSale);
router.get("/", saleController.getSales);
router.get("/:id", saleController.getSale);
=======
const authenticateToken = require("../middleware/auth");

router.get("/sales/:id/pdf", authenticateToken, saleController.generateSalePDF);
router.post("/", authenticateToken, saleController.createSale);
router.get("/", authenticateToken, saleController.getSales);
router.get("/:id", authenticateToken, saleController.getSale);
router.delete("/:id", authenticateToken, saleController.deleteSale);
>>>>>>> master

module.exports = router;
