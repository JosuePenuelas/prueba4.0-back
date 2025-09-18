const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
<<<<<<< HEAD

// CRUD usuarios
router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
=======
const authenticateToken = require("../middleware/auth");
// CRUD usuarios
router.post("/", userController.createUser);
router.get("/", authenticateToken, userController.getUsers);
router.get("/:id", authenticateToken, userController.getUser);
router.put("/:id", authenticateToken, userController.updateUser);
router.delete("/:id", authenticateToken, userController.deleteUser);
>>>>>>> master

// Login
router.post("/login", userController.loginUser);

module.exports = router;
