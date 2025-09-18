const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
<<<<<<< HEAD

router.get("/", dashboardController.getDashboard);
=======
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, dashboardController.getDashboard);
>>>>>>> master

module.exports = router;
